from flask import Flask, request, jsonify

import smtplib


app = Flask(__name__)

file = open("email_data.txt","r")

EMAIL_ADDR = file.readline().strip()
EMAIL_PASS = file.readline().strip()


@app.route("/send-email", methods=["POST"])
def send_email():
    data :dict = request.get_json()

    to_email = data.get("to")
    subject = data.get("subject")
    message = data.get("message")

    if not to_email or not subject or not message:
        return jsonify({"error": "Missing required fields"}), 400

    email_text = f"Subject: {subject}\n\n{message}"

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(EMAIL_ADDR, EMAIL_PASS)
            server.sendmail(EMAIL_ADDR, to_email, email_text)
        return jsonify({"message": "Email sent successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True,port=5002)

    pass



