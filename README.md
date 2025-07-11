# Angular-TaskApp
This project demonstrates proper utilization of Angular Fundamentals:
-There is a components file containing the code for a "Task Card" that contains string values for a given task. The "Task Card" has working buttons that can Complete/View/Edit an existing Task.
-There are different pages you can visit; homepage (AKA taskList), edit task (AKA taskEdit) add task (AKA taskForm) and view task (AKA taskView).
-This project utlizes both reactive and template driven forms. Reactive forms are used to edit a task, and template driven form is used to create a task.
-There is event binding, for example <button(click)> on several of the buttons. For others, like view and edit, there is an anchor to a hyperlink wrapped around the button. 
-There is a services folder that contains information and methods to be used to share data between files and components.
-Some Error handling and Input Validation was created and applied to many of the folders, look at app/components/error-message.

As an additional bonus I added styles and colors to the project to make the UI look better. The task-cards rise when you hover over them with your cursor, buttons are colorized and there is even an error function that turns your pointer into an error cursor (red circle) when you attempt to do something restricted. 


