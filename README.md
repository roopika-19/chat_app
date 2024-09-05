# Documentation

### Table of Content
- [Student Details](#student-details)
- [Features](#features)
- [Setup](#setup)
- [Database](#database)
- [Models](#models)
- [Backend](#backend)
  - [Technologies Used](#technologies-used)
  - [APIs](#apis)
- [Frontend](#frontend)
  - [Technologies Used](#technologies-used-1)

### Student Details
---
Name:  Roopika Saxena
Roll Number: 220010050
College: Indian Institute of Technology Dharwad
Departmant: Computer Science and Engineering


### Features

---

Built on top of **NodeJS** and **NextJS** app offers a wide variety of features, from real time messages to real time notifications. I have used **Socket.io** to make sure that the messages are recieved as soon as possible, and the user is notified when there is any unread message.

The chats are retained as they are stores on a **MongoDB Cluster** and can be seen by the user at any point of time. _Incomplete, but this app also offers people to have video calls and audio calls in real time._

If no-one is online then the user can have a chat with the AI too, I have integrated **Google's Gemini** as a chatbot as a part of this app.

### Setup

---

This is the example `.env` file for the backend:

```shell
cd ./be
touch .env
```

Past this with correct credentials in the `.env` file made just now.

```env
PORT=5000
MONGODB_URI=<YOUR MONGO URL>
JWT_SECRET=<YOUR JWT SECRET>
```

Run the following commands :

- Install the backend dependancies

```shell
cd ./be
pnpm install
```

- Install the frontend dependancies

```shell
cd ./fe
pnpm install
```

- Start the frontend

```shell
cd ./fe
pnpm run dev
```

- Start the backend

```shell
cd ./fe
pnpm start
```

- Go to http://localhost:3000/login

### Database

---

I am using **MongoDB** as the database, I choose NoSQL for faster retrival, and storage of the large amount of data effectively.

I am using **mongoose** as the ORM to interact with the database.

### Models

---

- #### `Chat`

  This holds all the conversations between users and within groups.

  **Schema**

  ```
  COLUMN        TYPE                DESCRIPTION
  --------------------------------------------------------------------
  chatName      string              Name of the chat
  --------------------------------------------------------------------
  isGroupChat   boolean             To distinguish group and one-to-one chats
  --------------------------------------------------------------------
  users         Array<ObjectIds>    Users inside the chat
  --------------------------------------------------------------------
  latestMessage ObjectId            Ref to the last message of the chat.
  --------------------------------------------------------------------
  groupAdmin    ObjectId            Admin, if chat is agroup

  ```

- #### `User`

  This holds the details of all the users.

  **Schema**

  ```
  COLUMN        TYPE                DESCRIPTION
  --------------------------------------------------------------------
  name          string              Name of the user
  --------------------------------------------------------------------
  email         string              EmailId of the user
  --------------------------------------------------------------------
  password      string              Hashed password of the user
  --------------------------------------------------------------------
  pic           string              URL of the profile picture
  --------------------------------------------------------------------
  isAdmin       string              Is the administrator user.

  ```

- #### `Message`

  This holds all the messages and these are show inside chats.

  **Schema**

  ```
  COLUMN        TYPE                DESCRIPTION
  --------------------------------------------------------------------
  sender        ObjectId            Message Sender
  --------------------------------------------------------------------
  content       string              Message Body
  --------------------------------------------------------------------
  chat          ObjectId            Chat which the message belongs to
  --------------------------------------------------------------------
  readBy        Array<ObjectIds>    All the people who read the message

  ```

### Backend

---

- #### Technologies Used

  I have built the backend on **NodeJS** with **ExpressJS** and **Typescript** for type safety. <br>
  These are the technologies that are used in backend

  1. **NodeJS** : as the javascript runtime to run my backend server.
  2. **ExpressJS** : as the javascript framework to make my server, I am comfortable with it and have done many projects in it hence using this as my backend framwork.
  3. **Typescript** : typescript provides typesafety which stops error much before they are seen in the working application, also this is now being adopted widely.
  4. **Socket.io** : for web-socket integration, this library is well documented and easy to use.
  5. **Cloudinary** : to store the user's profile picture.
  6. **JWT** : for access token for the users.

- #### APIs

  1. `/api/user` : Provides register and login functionalities.

     - `POST /register` : For registering the user.
     - `POST /login` : For login of an existing user.

  2. `/api/chat` : Routes related to user chats, sending, recieving.

     - `GET /`: Get all the existing chats of the user.
     - `POST /`: Get a particular chat's data.
     - `POST /group` : Create a group chat.
     - `PUT /rename` : Rename a group chat.
     - `PUT /groupremove` : Remove a person from a group.
     - `PUT /groupadd` : Add a person to a group.

  3. `/api/message` : Routes related to message sending and retrival.
     - `POST /` : Send message to a particular chat.
     - `POST /:chatId` : Get messages realted a particular chat.

- #### Socket Verbs
  1. `setup` : Initialize a user in the socket.io server.
  2. `join chat` : Joins the user to a chat-room.
  3. `typing` : To send typing or not typing updates between users.
  4. `new message` : To inform the user, when a new message is sent.
  5. `message_received` : For the reciever-end to get information of recieving a message.
  6. `disconnect` : Disconnect the user.

### Frontend

I am using **NextJS** with **Typescript** as my frontend framework. Though I am not using the backend features provided by NextJS, I am using it for server side rendering and in-house optimizations provided by it. I have integrated **Agora** voice and video SDKs for video and audio calling, _it is incomplete due to time constraints_.

- #### Technologies Used

  1. **NextJS** : I chosen Next.js for its SSR capabilities and in-house optimizations. SSR improves initial page load performance by rendering pages on the server, and Next.js simplifies this process.
  2. **Typescript** : ypeScript enhances code quality, provides better tooling support, and helps prevent runtime errors. It’s especially valuable in large projects.
  3. **ShadCn** : One of the fastest growing headless design librairies, it provides me full control over how I want my components to look.
  4. **Tailwind** : Tailwind simplifies styling by allowing you to compose styles using utility classes. It promotes consistency and speeds up development.
  5. **Agora** : Agora’s SDKs make it easy to add real-time communication features to your application.
  6. **Socket.io** : It allows seamless-realtime communication between clients and the server.
