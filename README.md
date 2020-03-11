# hireHER

hireHER is a responsive web application built using HTML, CSS, and Javascript. It was created to solve the issue of subtle 
linguistic gender coding in hiring descriptions. Hiring managers can submit their job descriptions as a PDF and the application
will scan through it, identify statistics-proven masculine vocabulary, and provide suggestions of gender-neutral alternatives 
to those words. 

The hiring manager can submit a PDF of their hiring description and it is uploaded to Google Cloud Storage. Google Vision will
then transform the PDF into necessary format. We trained a model using Natural Language Processing to identify all statistically-
proven masculine words from the hiring description. Finally, the original PDF and the identified key words are passed to the 
front-end and highlighted in bold yellow so the user can easily spot them. Beneath the original document is a table with the 
identified masculine key words as well as its gender-neutral alternative.
