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

<h2>Project Overview</h2>

<p>
This project is a full-stack implementation inspired by Google’s <b>Quick, Draw!</b>:
</p>

<ul>
  <li>
    <b>Frontend (React)</b>: a web interface where the user draws sketches on a
    canvas (single-player and multi-player modes). The frontend manages the
    drawing experience, authentication flow, and game screens.
  </li>
  <li>
    <b>Backend (Node.js / Express)</b>: exposes REST APIs and WebSocket endpoints
    for authentication (AWS Cognito), user/session management, and
    multi-player game logic.
  </li>
  <li>
    <b>ML Server (FastAPI + TensorFlow)</b>: receives vectorized drawing data
    (sequence of strokes), runs inference using an LSTM and a CNN, and returns
    the predicted class + confidence.
  </li>
</ul>

<p>
The typical user flow is:
</p>

<ol>
  <li>The user signs up / signs in (Cognito via the Node.js backend).</li>
  <li>The user draws on the canvas; the strokes are encoded as vectors.</li>
  <li>The backend or frontend sends these vectors to the FastAPI ML server.</li>
  <li>The ML server predicts the class (e.g. cat, house, tree…) and returns a confidence score.</li>
  <li>The result is displayed in real time in the UI.</li>
</ol>

<hr/>

<h2>Architecture</h2>

<h3>Frontend (React, Vite)</h3>

<ul>
  <li>Located in the <code>frontend-v2</code> folder.</li>
  <li>Built with React + Vite, using modern hooks and components.</li>
  <li>Implements drawing canvases (single and multi-player), authentication pages,
      dashboard, and waiting / state screens.</li>
  <li>Communicates with the Node.js backend via HTTP and WebSocket (Socket.IO).</li>
</ul>

<h3>Backend (Node.js / Express + AWS)</h3>

<ul>
  <li>Located in the <code>backend</code> folder.</li>
  <li>Provides REST APIs for authentication (AWS Cognito), health checks, and
      prediction routing.</li>
  <li>Uses AWS Cognito for user auth and DynamoDB for persistence.</li>
  <li>Includes a Socket.IO server to manage real-time multi-player game sessions.</li>
</ul>

<h3>Machine Learning Server (FastAPI)</h3>

<ul>
  <li>Located in the <code>ml-server</code> folder.</li>
  <li>Built with FastAPI and TensorFlow/Keras.</li>
  <li>Loads two models:
    <ul>
      <li><b>LSTM model</b> (<code>lstm_drawing_classifier.h5</code>) for sequence data.</li>
      <li><b>CNN model</b> (<code>doodle_classifier_model.h5</code>) for image data.</li>
    </ul>
  </li>
  <li>Exposes two main endpoints:
    <ul>
      <li><code>POST /predict</code>: takes stroke vectors and runs the LSTM model.</li>
      <li><code>POST /predict_cnn</code>: converts vectors to an image and runs the CNN.</li>
    </ul>
  </li>
</ul>

<hr/>

<h2>How to run</h2>

<h3>Backend</h3>

<p>
Configure your AWS credentials (Cognito &amp; DynamoDB) via environment variables
in the <code>.env</code> file. Use the values provided by your instructor / team
and <b>do not commit them</b> to version control.
</p>

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

<p>
Use the test credentials provided separately by the team or instructor
to sign in on the login page.
</p>

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


