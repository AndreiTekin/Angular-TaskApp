# Angular-TaskApp
<h2>Project description:</h2>


This project is  task management web application that allows users to log in to a customized portal and organize/manage tasks built on using MEAN stack


Some notable elements of the app:

-The app has a signup/login, and pages are protected by authguards. The portal also recognizes users by name.

-The app uses reactive and staic forms, on the TaskForm page (aka "add a new task") tasks are created and then on the back end a unique ID is assigned to them (see createNewTask method in TaskService.ts)

-To improve the UI, tasks are built on a TaskCard component, which is a floating card that contains information about the task and buttons like view/edit/complete, upon completion the user has the option to delete the task or keep the task visible.

-There is a styling palette that was used to design the app, and various stylistic changes were made to make the UI more approachable, Like Containers, a sandwich menu, button highlighting and a live dashboard on the homepage.

-Within the app there is a services file TaskService.ts that contains information about key methods that structure the app.

-Error handling and Input Validation was created and applied to all of the folders, look at app/components/error-message, additionally there are several console logs to be used for error handling on the backend (server.js)





<h2>Setup Instructions</h2>

Step 1: Clone the Repo :   

git clone https://github.com/AndreiTekin/Angular-TaskApp.git

cd Angular-TaskApp


Step 2: Install dependencies:

npm install 


Step 3: Create a .env file in the project root:

JWT_SECRET = ########

(Replacing the hashtags with your own strong unique value)


Step 4: Build the Angular FrontEnd:

ng build


Step 5: Start the server:

npm start


Step 6: Visit [http://localhost:3000] 

Alternatively you could run node server.js and ng serve to visit [http://localhost:4200]




<h2>Deployment URLS</h2>

Backend on Render: https://angular-taskapp.onrender.com/

Frontend using Vercel: https://angular-task-app-seven.vercel.app/








