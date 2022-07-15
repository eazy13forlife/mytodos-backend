# MyTodos (backend)

Backend for MyTodos application. Utitlizes a MongoDB database.

## Live Url
https://mytodos-frontend.vercel.app/

## Images
### Desktop
![Screen Shot 2022-06-04 at 8 18 21 PM](https://user-images.githubusercontent.com/72288176/172033550-8875d59a-08dc-4712-b84e-af48cb73a2c1.png)
![Screen Shot 2022-06-04 at 8 17 27 PM](https://user-images.githubusercontent.com/72288176/172033552-4313c6a2-2675-4850-9c20-9c44002a470a.png)
### Mobile
![Screen Shot 2022-06-04 at 10 16 55 PM](https://user-images.githubusercontent.com/72288176/172036191-94cb6fc4-cd1a-4b7c-be3e-0cd1db10de72.png)

## Technologies

* React
* Javascript
* SCSS
* Node.js
* Express.js
* Mongoose
* NoSQL

## Notable Features
* Fully responsive
* Login/SignUp page
* User's login info saved to local storage to prevent always having to log in
* User's filter and sort settings saved to local storage as well to prevent having to reconfigure on app load
* User can save tasks in one of the default folders (Inbox, Today, Upcoming) or create a custom project folder
* User can filter and sort tasks based on criteria like priority, due date, creation, date and name
* User can check how many tasks they have completed in total.

## What I Learned
* I can and should use hooks to separate business logic from ui logic
* Route redirecting with react-router-dom is great for the ability to access certain routes only if user is authenticated
* Use folder structure where all files for a specific component are within that folder

## Ideas to implements
* Forgot password link
* Pinterest style notes section where a user can dynamically add, remove or edit notes
