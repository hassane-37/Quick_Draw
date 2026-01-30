<div align="center">

  <h1 style="font-size: 42px; margin-bottom: 10px;">
     Quick Draw — Machine Learning Sketch Recognition
  </h1>

  <p style="font-size: 18px; max-width: 800px;">
    A full-stack implementation inspired by Google’s <b>Quick, Draw!</b> project,
    combining <b>React</b>, <b>Node.js</b>, and <b>Machine Learning</b> to recognize
    hand-drawn sketches in real time.
  </p>

  <br/>

  <img src="https://img.shields.io/badge/Frontend-React-blue" />
  <img src="https://img.shields.io/badge/Backend-Node.js-green" />
  <img src="https://img.shields.io/badge/ML-FastAPI-orange" />
  <img src="https://img.shields.io/badge/Models-CNN%20%2B%20LSTM-purple" />

</div>

<hr/>

<h2>How to run</h2>

<h3>Backend</h3>

<p>
Log in to the AWS Lab using my credentials:
</p>

<ul>
  <li><b>Email:</b> <i>saad.rouyass@telecom-st-etienne.fr</i></li>
  <li><b>Password:</b> <i>(check Whatsapp group)</i></li>
</ul>

<p>
From the AWS Lab page, click on <b>AWS Details</b> and copy the following values:
</p>

<ul>
  <li><code>AWS_ACCESS_KEY_ID</code></li>
  <li><code>AWS_SECRET_ACCESS_KEY</code></li>
  <li><code>AWS_SESSION_TOKEN</code></li>
</ul>

<p>
Paste these values into the first three lines of the <code>.env</code> file:
</p>

<pre>
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_SESSION_TOKEN=...
</pre>

<p>Start the backend server:</p>

<pre>
cd backend
npm install
cd src
node server.js
</pre>

<hr/>

<h3>Frontend</h3>

<p>Start the frontend application:</p>

<pre>
cd frontend-v2
npm install
npm run dev
</pre>

<p>NOTE!!!: WHEN YOU RUN THE FRONTEND ,IN THE SIGNIN PAGE ENTER : </p>

<pre>
saadrouisse01@gmail.com
123Saad@123
</pre>

<hr/>

<h3>Machine Learning Server</h3>

<p>Start the ML inference server:</p>

<pre>
cd ml-server
pip install -r requirements.txt
uvicorn ml_server:app --reload --port 8000
</pre>

<hr/>
</body>
</html>


