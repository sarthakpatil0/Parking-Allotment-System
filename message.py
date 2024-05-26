from twilio.rest import Client

account_sid = '#your_twilio_account_sid'
auth_token = '[AuthToken]'
client = Client(account_sid, auth_token)

message = client.messages.create(
  from_='whatsapp: #twilio_whatsapp_number',
  body='Your Parking time end in 15 minutes.',
  to='whatsapp: #your_number'
)

print(message.sid)
