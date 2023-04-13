from flask import Flask, request, jsonify, send_file
from docxtpl import DocxTemplate
import os
from docx2pdf import convert
import pythoncom
from datetime import datetime

app = Flask(__name__)


@app.route("/hello")
def hello():
    return "Hello, World!"


@app.route("/process_document", methods=["POST"])
def process_document():
    if "file" not in request.files:
        return "No file uploaded", 400

    file = request.files["file"]
    if file.filename == "":
        return "No file uploaded", 400

    if (
        file.mimetype
        != "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ):
        return "Invalid file format", 400

    # this is needed otherwise the upload might fail
    pythoncom.CoInitialize()

    # Save the uploaded DOCX file to a temporary file
    temp_docx_file = "preview.docx"
    file.save(temp_docx_file)

    # Convert the temporary DOCX file to PDF
    temp_pdf_file = "preview.pdf"
    if os.path.exists(temp_pdf_file):
        os.remove(temp_pdf_file)  # remove existing file
    convert(temp_docx_file)

    # Remove the temporary DOCX file
    os.remove(temp_docx_file)

    try:
        doc = DocxTemplate(file)
        set_of_variables = doc.get_undeclared_template_variables()
        return jsonify(variables=list(set_of_variables))

    except Exception as e:
        return str(e), 500


@app.route("/generate_template", methods=["POST"])
def generate_template():
    form_data = request.form.to_dict()
    file = request.files["file"]

    # Save the file to disk temporarily
    file.save("temp_file.docx")

    with open("temp_file.docx", "rb") as f:
        first = f.readline().decode("ANSI")
        print("First line of the template:", first)

    doc = DocxTemplate("temp_file.docx")

    context = {}
    for field, value in form_data.items():
        if field != "file":
            field_type = form_data.get(f"{field}-type")
            if field_type == "Number":
                value = int(value)
            elif field_type == "Date":
                value = datetime.strptime(value, "%Y-%m-%d").date()
            context[field] = value

    doc.render(context)
    doc.save("generated_template.docx")

    os.remove("temp_file.docx")

    with open("generated_template.docx", "rb") as f:
        first_line = f.readline().decode("ANSI")
        print("First line of the generated template:", first_line)

    return send_file(
        "generated_template.docx",
        as_attachment=True,
        mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document charset=windows-1252",
    )


@app.route("/get_preview")
def get_preview():
    try:
        # Open the PDF file in binary mode and return it to the frontend
        return send_file(
            "preview.pdf",
            mimetype="application/pdf",
            as_attachment=True,
        )
    except Exception as e:
        return str(e), 500


if __name__ == "__main__":
    app.run(debug=True)
