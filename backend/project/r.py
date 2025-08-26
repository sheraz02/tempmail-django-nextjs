import random, string


def generate_email():
    username = ''.join(random.choices(string.ascii_lowercase + string.digits, k=10))
    return f"{username}@sheraz.com"

for i in range(10):
    print(generate_email())