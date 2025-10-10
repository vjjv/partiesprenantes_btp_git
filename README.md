# Camera Kit Web Demo with Recording Feature 🎥

> Created by [gowaaa](https://www.gowaaa.com) 🚀
> A creative technology studio specializing in AR experiences

[繁體中文](README.zh-TW.md) | English

### Key Changes in Latest Version [12th Aug 2025]

- **Remote API Integration** 📡
  - Added comprehensive guide to use remote API to detect button press from Lens
  - Added `remoteAPI.js` to handle remote API requests from Lens
  - Included bilingual setup guides: [remoteAPIGuide.md](src/remoteAPIGuide.md) (English) and [remoteAPIGuide.zh-tw.md](src/remoteAPIGuide.zh-tw.md) (Traditional Chinese)

### Key Changes in Latest Version [7th Aug 2025]

- Added launchParams capability to send data to Lens at launch
- Capture & Live render target now works exactly as it is on Lens Studio when you press record button
- To record capture render target, set recordCaptureRenderTarget to be true in settings.js
- Video preview added when recording stop
- **Audio Recording Enhancement**: Audio from lens can now be recorded together with the video and mic input, but if there is any change in audio track within the lens, the change will not be recorded
- Modular JavaScript files for better code organization:
  - `camera.js`: Handles camera initialization and management
  - `recorder.js`: Manages video recording functionality
  - `ui.js`: Controls UI elements and interactions
  - `videoProcessor.js`: Handles video processing operations
  - `settings.js`: Centralizes configuration settings

A web application demonstrating Snap's Camera Kit integration with video recording capabilities. This project allows users to apply Snap Lenses and record videos with the effects.

> ⚠️ **SECURITY WARNING**  
> **HOW TO USE THIS REPO SAFELY**  
> Follow these steps to keep your app secure:
>
> 1. For local development:
>
>    - Copy `.env.example` to create your own `.env` file
>    - Add your Camera Kit credentials to `.env`
>    - Never share or commit your `.env` file
>    - ⚠️ **NEVER** put credentials directly in your code files
>
> 2. For deployment:
>    - Use Vercel (recommended hosting platform)
>    - Add your credentials in Vercel's Settings → Environment Variables
>    - Follow our [Deployment Guide](#deployment-on-vercel-)
>    - Note that the credentials WILL STILL BE EXPOSED, but Snapchat has inbuilt CORS origin check to allow only the approved URL to access the app token, which can be setup will you send the camera kit app for approval
>    - For extra security, it is recommended to store the tokens on AWS secret manager and retrieve it via AWS Lambda and Gatway API

> ✅ This setup keeps your credentials safe and your app secure!

🔗 [Live Demo](https://camerakit.gowaaa.com/)

## Features ✨

- **Snap Lens Integration** 🎭
- **Video Recording** 📹
- **Front/Back Camera Switch** 🔄
- **Share Recording** 📤
- **Download Recording** ⬇️
- **Loading Animation** ⌛
- **Responsive Design** 📱

## Tech Stack 🛠️

- Camera Kit for Web V1.8.0
- FFmpeg.wasm (for video processing)
- Webpack 5
- MediaRecorder API
- Web Share API

## Project Structure 📁

```
camerakit-web-w-recordfeature/
├── LICENSE                    # MIT license
├── README.md                  # English documentation
├── README.zh-TW.md           # Traditional Chinese documentation
├── build/                    # Build output directory (generated)
├── node_modules/             # Node.js dependencies (generated)
├── package-lock.json         # Dependency lock file
├── package.json              # Project dependencies and scripts
├── public/
│   └── ffmpeg/              # FFmpeg WebAssembly files
│       ├── ffmpeg-core.js
│       └── ffmpeg-core.wasm
├── src/
│   ├── assets/              # Images and icons
│   │   ├── BackButton.png
│   │   ├── DownloadButton.png
│   │   ├── LoadingIcon.png
│   │   ├── Powered_bysnap.png
│   │   ├── RecordButton.png
│   │   ├── RecordOutline.png
│   │   ├── RecordStop.png
│   │   ├── ShareButton.png
│   │   └── SwitchButton.png
│   ├── styles/              # CSS files
│   │   └── index.v3.css
│   ├── camera.js            # Camera functionality and management
│   ├── recorder.js          # Video recording functionality
│   ├── ui.js               # UI management and interactions
│   ├── videoProcessor.js   # Video processing logic
│   ├── settings.js         # Configuration settings
│   ├── launchParams.js     # Launch parameter handling for Lens data
│   ├── remoteAPI.js        # Remote API communication with Lens
│   ├── remoteAPIGuide.md   # Remote API setup guide (English)
│   ├── remoteAPIGuide.zh-tw.md # Remote API setup guide (Traditional Chinese)
│   ├── index.html          # Main HTML file
│   └── main.js             # Main JavaScript entry point
├── vercel.json             # Vercel deployment configuration
└── webpack.config.js       # Webpack build configuration
```

## Getting Started 🚀

### Prerequisites 📋

- Node.js (v14 or higher) - [Download here](https://nodejs.org/)
- npm (comes with Node.js)
- Camera Kit credentials from Snap

> 💡 **New to Node.js?**
>
> 1. Download and install Node.js from [nodejs.org](https://nodejs.org/)
> 2. After installation, open your terminal/command prompt
> 3. Verify installation by typing:
>    ```bash
>    node --version
>    npm --version
>    ```
>    Both commands should show version numbers

### Installation 💿

1. Clone the repository:

   > 💡 **New to GitHub?**  
   > Choose one of these methods:
   >
   > **Option A: Using GitHub Desktop (Recommended for beginners)**
   >
   > - Download [GitHub Desktop](https://desktop.github.com/)
   > - Click the green "Code" button above
   > - Click "Open with GitHub Desktop"
   > - Choose where to save it on your computer
   >
   > **Option B: Using Git command line**

   ```bash
   git clone https://github.com/gowaaa/camerakit-web-w-recordfeature.git
   cd camerakit-web-w-recordfeature
   ```

2. Install dependencies:

```bash
npm ci
```

> 💡 **Note**: For first-time installation, `npm ci` is recommended as it:
>
> - Ensures exact versions from package-lock.json
> - Is faster and more reliable
> - Provides consistent installations across all environments
>
> Only use `npm install` if you need to modify dependencies (add new ones or update existing ones).

3. Configure Camera Kit credentials:
   Create `.env` file in the root directory:

```
LENS_ID=__LENS_ID__
GROUP_ID=__GROUP_ID__
API_TOKEN=__API_TOKEN__
```

### Development 🔧

Start the development server:

```bash
npm run serve
```

Webpack will start a development server with HTTPS enabled.
You'll see two URLs in the terminal:

- Local: `https://localhost:9000`
- Network: `https://YOUR_IP_ADDRESS:9000` (for mobile devices)

To test on your mobile device, use the Network URL shown in your terminal.

⚠️ **Notes**:

- Your mobile device must be on the same WiFi network as your computer
- Accept the self-signed certificate warning in your browser when testing
- HTTPS is required for camera access on mobile devices

### Production Build 🏗️

Build the project:

```bash
npm run build
```

Output will be in a new `build` directory.

### Deployment on Vercel 🚀

To deploy securely on Vercel:

1. Create a Vercel account at [vercel.com](https://vercel.com)

   - Click "Sign Up"
   - Choose "Continue with GitHub"
   - Follow the authorization steps

2. Import your GitHub repository:

   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your repository
   - Click "Import"

3. Add your Camera Kit credentials as environment variables:

   - In your project dashboard, go to "Settings" → "Environment Variables"
   - Add these three variables exactly as shown:
     ```
     LENS_ID=your_actual_lens_id_here
     GROUP_ID=your_actual_group_id_here
     API_TOKEN=your_actual_api_token_here
     ```

4. Deploy your project:
   - Vercel will automatically detect and use the environment variables
   - Your credentials will be securely stored and used during build time

⚠️ **Security Note**:

- Using environment variables on Vercel keeps your credentials secure
- Never commit actual credentials to your repository
- Use `.env.example` for reference (copy to `.env` and add your credentials for local development)
- Keep your `.env` file in `.gitignore`

## Browser Support 🌐

- Chrome (latest) ✅
- Firefox (latest) 🦊
- Safari (iOS 14.5+) 📱
- Edge (latest) 🌍

## Troubleshooting 🔧

### Common Issues ⚠️

1. **Build Errors**:

   - Ensure all dependencies are installed
   - Check webpack configuration
   - Verify file paths in imports

2. **Camera Issues**:

   - Use HTTPS for camera access
   - Grant camera permissions
   - Check browser compatibility

3. **Recording Issues**:
   - Ensure sufficient device storage
   - Check MediaRecorder support
   - Verify permissions

## License 📄

MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Acknowledgments 👏

- Based on Vincent Trastour's Camera Kit tutorial: [Watch on YouTube](https://www.youtube.com/watch?v=ZQM9Ua_JKMY)
- Built with [Snap Camera Kit](https://kit.snapchat.com/camera-kit)
- Uses [FFmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm)
- Project improvements with help from Hong Wei ([@hongweitangcom](https://www.instagram.com/hongweitangcom/))
- Lens audio recording method discovered by [@newyellow](https://github.com/newyellow/CameraKit-Record-Template)
- Remote API guide made possible with help from [@bastiensaro](https://www.filtre-experience.fr/)

## ⚠️ Important Note About Dependencies

This project requires specific dependency versions to function correctly. Please:

- Do not modify `package-lock.json`
- Use `npm ci` instead of `npm install` because:
  - It's faster and more reliable
  - It ensures exact versions from package-lock.json
  - It removes node_modules before installing
  - It won't update package.json or package-lock.json

The Camera Kit integration is sensitive to dependency versions. Modifying these may break the functionality.

---

Happy coding! 🎥✨
