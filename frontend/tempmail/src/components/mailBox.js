"use client";
import { useState, useEffect } from "react";
import { Mail, MailOpen, User, Clock } from "lucide-react";

const MailBox = ({ activeEmail, refreshTrigger }) => {
  const [emails, setEmails] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);

  // Fetch all mails when new email is generated
  const fetchMails = async (email) => {
    try {    
      const res = await fetch(`api/mails/${email}`);
      if (!res.ok) throw new Error("Failed to fetch mails");
      const data = await res.json();
      setEmails(data.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Refresh (only fetch latest incoming mails)
  const refreshMails = async () => {
    if (!activeEmail) return;
    try {
      const res = await fetch(`/api/mails/${activeEmail}/refresh`);
      if (!res.ok) throw new Error("Failed to refresh inbox");
      const data = await res.json();

      if (data.messages?.length > 0) {
        // prepend new mails at the top
        setEmails((prev) => [...data.messages, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // On new email or refreshTrigger
  useEffect(() => {
    setEmails([]); // reset
    setSelectedMail(null);

    if (activeEmail) {
      fetchMails(activeEmail);
    }
  }, [activeEmail]);

  // When refresh button clicked in Header
  useEffect(() => {
    if (refreshTrigger) {
      refreshMails();
    }
  }, [refreshTrigger]);

  // (Optional) Auto-refresh every 10s
  // useEffect(() => {
  //   if (activeEmail) {
  //     const interval = setInterval(() => {
  //       refreshMails();
  //     }, 10000);
  //     return () => clearInterval(interval);
  //   }
  // }, [activeEmail]);

  //  Open mail
  const openMail = (email) => {
    setSelectedMail(email);
    setEmails((prev) =>
      prev.map((m) => (m.id === email.id ? { ...m, read: true } : m))
    );
  };

  return (
    <section className="min-h-[670px] bg-black text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 border-r border-cyan-500/30 bg-black/60 overflow-y-auto">
        <h2 className="text-2xl font-bold text-cyan-300 px-6 py-4 flex items-center gap-2 sticky top-0 bg-black/80">
          <Mail className="w-5 h-5 text-cyan-400" /> Mailbox
        </h2>

        {emails.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 py-10">
            <Mail className="w-12 h-12 text-cyan-500/40 mb-3" />
            <p>No messages yet</p>
          </div>
        ) : (
          <ul className="divide-y divide-cyan-500/20">
            {emails.map((email) => (
              <li
                key={email.id}
                onClick={() => openMail(email)}
                className={`p-4 cursor-pointer hover:bg-cyan-500/20 ${
                  selectedMail?.id === email.id ? "bg-cyan-500/30" : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 font-semibold text-cyan-200">
                    <User className="w-4 h-4 text-cyan-400" /> {email.sender}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {email.received_at}
                  </span>
                </div>
                <p
                  className={`text-sm ${
                    email.read ? "text-gray-300" : "font-bold text-white"
                  }`}
                >
                  {email.subject}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mail Content */}
      <div className="flex-1 p-6">
        {selectedMail ? (
          <div>
            <h3 className="text-2xl font-bold text-cyan-300 mb-2 flex items-center gap-2">
              <MailOpen className="w-6 h-6 text-cyan-400" />{" "}
              {selectedMail.subject}
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              From: {selectedMail.sender} • {selectedMail.received_at}
            </p>
            <p className="text-lg text-white/90">{selectedMail.body}</p>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select an email to view its content
          </div>
        )}
      </div>
    </section>
  );
};

export default MailBox;
