import imaplib
import email
import os
import datetime
import re


word = ["hello", "hello,","Thanks and Regards", "From: Lord Lewin", "Sent:", "To:","Subject:","Can you please help me in answering","Regards","Lord Lewin"] #list of strings to search for in email body

mail = imaplib.IMAP4_SSL('imap.gmail.com')
# imaplib module implements connection based on IMAPv4 protocol
mail.login(os.environ["GMAIL_USER"], os.environ["GMAIL_PASSWORD"])

mail.list() # Lists all labels in GMail
mail.select('inbox') # Connected to inbox.

date = (datetime.date.today() - datetime.timedelta(1)).strftime("%d-%b-%Y")
# result, data = mail.uid('search', None, '(SENTSINCE {date})'.format(date=date))
(result, data) = mail.uid('search',None, '(UNSEEN)')

i = len(data[0].split()) # data[0] is a space separate string
for x in range(i):
    original_email_uid = data[0].split()[0] # unique ids wrt label selected 
    latest_email_uid = data[0].split()[x] # unique ids wrt label selected
    result, email_data = mail.uid('fetch', latest_email_uid, '(RFC822)')
    # fetch the email body (RFC822) for the given ID
    raw_email = email_data[0][1]

    raw_email_string = raw_email.decode('utf-8')
    # converts byte literal to string removing b''
    email_message = email.message_from_string(raw_email_string)

    
    
    # this will loop through all the available multiparts in mail
    for part in email_message.walk():
        if part.get_content_type() == "text/plain": # ignore attachments/html
            body = part.get_payload(decode=True)
            print("Mail Body is ",body)
            lines = re.split(r"[~\r\n]+", body.decode('utf-8'))
            for line in lines:
                if not any([line.lower().startswith(word.lower()) for word in word]):
                # if any(word in line for word in word):
                    # print('Skipping ****')
                    # print(line)
                    # print('****')
                    if line.lower().startswith("query:"):
                        print(line.replace("Query:","").strip())
                    else:
                        print(line)
        else:
            continue

