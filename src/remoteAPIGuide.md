# Remote API Lens Button Detection Setup Guide

Credits to @bastiensaro (https://www.filtre-experience.fr/) for making the guide possible

Step-by-step guide to setting up remote API to detect button press from Lens to Camera Kit for Web.

## 🔧 Setting up the Remote API

### Create a New API

1. Go to https://my-lenses.snapchat.com/apis/
2. Click **"Add a new API"**
3. Fill in the following details (ignore all optional inputs):

### API Specification Settings

| Field                  | Value                                                       | Notes                                                                                             |
| ---------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Name**               | `Button Press API`                                          | (or any name you prefer, this will be the name you see when importing the API from Asset Library) |
| **Provider**           | Your name                                                   | (or any name you prefer)                                                                          |
| **Description**        | `API to detect button pressed event from lens`              | (you can customize this, it won't affect API functionality)                                       |
| **Target Platforms**   | `Camera_Kit`                                                |                                                                                                   |
| **Username Allowlist** | Enter your Snap username                                    |                                                                                                   |
| **Request Processor**  | `Custom Processor`                                          |                                                                                                   |
| **Snap Kit App ID**    | Copy from MyLenses → your Camera Kit app → Developer Portal | Copy the ID below the app name                                                                    |
| **Host**               | Your username or anything you want                          | (this won't affect API functionality)                                                             |

### Endpoint Configuration

| Field                  | Value            | Notes                                          |
| ---------------------- | ---------------- | ---------------------------------------------- |
| **Reference ID**       | `button_pressed` | (this is the endpoint name)                    |
| **Path**               | `button_pressed` | (this can be anything, doesn't affect the API) |
| **Method**             | `GET`            |                                                |
| **Parameters**         | `button_id`      | (you can add as many parameters as you want)   |
| **Parameter Location** | `Query`          |                                                |
| **Required**           | `Yes`            |                                                |
| **Constant**           | `No`             |                                                |

4. Click **"Create your API"**

## 🎯 Lens Studio Setup

### Import API to Lens Studio

5. Open **Lens Studio**
6. Create a new project and import the API you just created from **Asset Library**
7. You will see JavaScript code created in your scene
8. Create a **screen button** and **2D text** in your scene

### Update the JavaScript Code

9. Open the JavaScript code provided from the API _(NOT the one that ends with "Module")_
10. Replace the existing code with the following:

```javascript
// @input Asset.RemoteServiceModule remoteServiceModule
// @input Component.InteractionComponent button
// @input Component.Text responseText

// Import module
const Module = require("./button_pressed API Module")
const ApiModule = new Module.ApiModule(script.remoteServiceModule)

script.button.onTap.add(() => {
  script.responseText.text = "pressed"

  // If you created a different endpoint name (reference ID), change it to ApiModule.YourEndPoint
  ApiModule.button_pressed({
    parameters: {
      "button_id": "12345", // Replace with actual parameter names and values
    },
  })
    .then((response) => {
      // Parse response as JSON string and log it
      print("Response metadata: " + JSON.stringify(response.metadata))
      print("Response body: " + response.bodyAsString())
      script.responseText.text = response.bodyAsString()
    })
    .catch((error) => {
      print(error + "\n" + error.stack)
    })
})
```

### Configure Script Inputs

11. Assign the **button** and **text** components to the script input fields
12. When you click the button, you will get a **bad request** in Lens Studio - this is normal, as it will only work on Camera Kit

## 📱 Deployment & Testing

### Lens Approval Process

13. **Submit your lens for approval**
14. Add your lens to **Lens Scheduler** if you haven't already (so you can run it on Camera Kit)

### Camera Kit Configuration

15. In your Camera Kit project, go to `settings.js` and set:
    ```javascript
    remoteAPISpecId: "YOUR_REMOTE_API_SPEC_ID_HERE",
    useRemoteAPI: true
    ```

### Final Steps

16. **Wait for lens to be approved**
17. Run the Camera Kit code locally

## ✅ Expected Result

When everything is set up correctly, you should see `button 12345 is pressed` in your console when you press the button in the lens.

18. Edit remoteAPI.js to suit your project needs

---

> **Note**: The API will only function properly when running on Camera Kit, not in Lens Studio preview mode.

> **Note**: Ensure that your specsID, endpoint and parameter names matches what you created in remoteAPI.js
