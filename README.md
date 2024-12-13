# Safe Space - Mental Health Exercises 
Safe Space is a React application that is build for mental health exercises. Currently, only "A Breath of Fresh Air" is available to explore.

## A Breath of Fresh Air: A Breathing Exercise Allowing Users to Choose A Background Image and Ambient Sound
This exercise allows users to explore and select ambient backgrounds and calming sounds and a relaxing animation to breath along. The chosen background can persist across sessions and the elected sound can be set as a looping background audio. The app offers predefined categories, search functionality, and a favorites feature.

## Features

- **Select a Background!:**
  - Choose ambient wallpapers from predefined categories like Forest, Sky, and Mountain.
  - Search for custom backgrounds using the search bar.
  - Set and persist the selected background image across sessions.
  - Learn more about the background image by clicking info button, download and browse similar images.

- **Save The Background to Your Favorites!:**
  - Save your favorite backgrounds for quick access later.

- **Set Your Ambient Sound!:**
  - Browse predefined categories such as Forest, Ocean, Rain, and Piano.
  - Search for custom ambient sounds using keywords.
  - Set a selected sound as a looping background audio.

- **Breath!:**
  - Navigate between the sound page, background selection page, and details page for more information on selected items.

## Challenges & Future Improvements

### Challenges
- **Stop Background Sound Button**: The "Stop Background Sound" button is currently not working as expected. I am working on a fix to ensure that the button can successfully stop the background audio when clicked.

### Workaround for Stopping Audio
- Currently, to stop the background audio, you can refresh the page. This will stop any audio that is playing.
  
### Future Improvements
- **Persistent Audio Control**: In the future, the ability to control the background audio more easily (pause, stop, change sound) directly from the interface will be implemented.
- **Additional Exercises**: Two more exercises will be added to enhance the platform’s interactivity.
- **Favorites Feature for Sound Cards**: A "Favorites" feature will be added to sound cards allowing users to favorite their preferred sounds as well. 
- **Error Handling**: Adding more detailed error messages to handle potential issues with the APIs, specifically with Freesound. 

## Installation Steps
 - npm install
 - cd space-space
 - npm run dev
 - go to the local host link provided


## API Integration

### Pexels API
- **Used to fetch high-quality background images.**
- **Base URL:** [https://api.pexels.com/v1/search](https://api.pexels.com/v1/search)
- **API Key:** Stored securely in the app's environment variables.

### Freesound API
- **Used to fetch ambient sound previews.**
- **Base URL:** [https://freesound.org/apiv2/](https://freesound.org/apiv2/)
- **API Key:** Stored securely in the app's environment variables.

## Acknowledgments

- **Pexels** for free high-quality images.
- **Freesound** for ambient sound resources.
- **Danielsz** for the animated circles effect, adapted from [this CodePen](https://codepen.io/dani3lsz/pen/vPbBML).