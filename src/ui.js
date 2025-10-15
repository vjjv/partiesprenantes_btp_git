import { Settings } from "./settings"

export class UIManager {
  constructor() {
    this.recordButton = document.getElementById("record-button")
    this.recordOutline = document.getElementById("outline")
    this.actionButton = document.getElementById("action-buttons")
    this.switchButton = document.getElementById("switch-button")
    this.loadingIcon = document.getElementById("loading")
    this.backButtonContainer = document.getElementById("back-button-container")
    this.recordPressedCount = 0

    // --- Tap to take photo, long press to record ---
    this.longPressTimeout = null
    this.isRecording = false
    this.longPressDuration = 400 // ms

    // Remove any existing click listeners (main.js should not add its own)
    this.recordButton.onclick = null
    this.recordButton.onmousedown = null
    this.recordButton.onmouseup = null
    this.recordButton.ontouchstart = null
    this.recordButton.ontouchend = null

    // Prevent context menu on long press (Chrome save image behavior)
    this.recordButton.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      return false
    })
    
    // Prevent drag and select behaviors
    this.recordButton.addEventListener('dragstart', (e) => {
      e.preventDefault()
      return false
    })
    this.recordButton.addEventListener('selectstart', (e) => {
      e.preventDefault()
      return false
    })
    
    // Set CSS properties to prevent dragging and selection
    this.recordButton.style.userSelect = 'none'
    this.recordButton.style.webkitUserSelect = 'none'
    this.recordButton.style.mozUserSelect = 'none'
    this.recordButton.style.msUserSelect = 'none'
    this.recordButton.style.webkitTouchCallout = 'none'
    this.recordButton.style.webkitUserDrag = 'none'
    this.recordButton.style.webkitTapHighlightColor = 'transparent'
    this.recordButton.draggable = false
    
    // Mouse events
    this.recordButton.addEventListener('mousedown', (e) => this._handlePressStart(e))
    this.recordButton.addEventListener('mouseup', (e) => this._handlePressEnd(e))
    this.recordButton.addEventListener('mouseleave', (e) => this._handlePressCancel(e))
    // Touch events
    this.recordButton.addEventListener('touchstart', (e) => this._handlePressStart(e), { passive: false })
    this.recordButton.addEventListener('touchend', (e) => this._handlePressEnd(e), { passive: false })
    this.recordButton.addEventListener('touchcancel', (e) => this._handlePressCancel(e), { passive: false })
    
    // Bind the context menu prevention method
    this._preventContextMenu = this._preventContextMenu.bind(this)
    
    // Hide record button initially and show after 13 seconds
    this.toggleRecordButton(false)
    setTimeout(() => {
      this.toggleRecordButton(true)
      console.log("Record button is now visible after 13 seconds")
    }, 13000) // 13 seconds
  }
  
  _preventContextMenu(e) {
    e.preventDefault()
    e.stopPropagation()
    return false
  }

  _handlePressStart(e) {
    if (this.isRecording) return
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
    
    // Prevent any default behaviors (drag, context menu, etc.)
    if (e.type === 'mousedown') {
      e.target.ondragstart = () => false
    }
    
    // For iOS, prevent long press context menu with additional techniques
    if (e.type === 'touchstart') {
      // Prevent iOS callout/context menu
      document.addEventListener('contextmenu', this._preventContextMenu, { passive: false, once: true })
      // Clear any existing selection
      if (window.getSelection) {
        window.getSelection().removeAllRanges()
      }
    }
    
    // Check if video mode is enabled before setting up long press
    if (!Settings.config.videoMode) {
      // Only photo mode enabled - no long press animation or timeout
      return
    }
    
    // Animate outline scale up and reduce opacity for visual feedback during long press
    this.recordOutline.style.transition = 'transform 0.2s cubic-bezier(0.4,0,0.2,1), opacity 0.2s cubic-bezier(0.4,0,0.2,1)'
    this.recordOutline.style.transformOrigin = 'center center'
    this.recordOutline.style.transform = 'translateX(-50%) scale(1.3)'
    this.recordOutline.style.opacity = '0.5'
    this.longPressTimeout = setTimeout(() => {
      this.isRecording = true
      this.updateRecordButtonState(true)
      // Dispatch custom event for start recording
      this.recordButton.dispatchEvent(new CustomEvent('record-start', {bubbles:true}))
    }, this.longPressDuration)
  }

  _handlePressEnd(e) {
    e.preventDefault()
    e.stopPropagation()
    
    // Clean up context menu prevention
    document.removeEventListener('contextmenu', this._preventContextMenu)
    
    // Revert outline animation (only if video mode was enabled)
    if (Settings.config.videoMode) {
      this.recordOutline.style.transform = 'translateX(-50%) scale(1)'
      this.recordOutline.style.opacity = '1'
    }
    
    if (this.longPressTimeout) {
      // Video mode enabled - handle long press logic
      clearTimeout(this.longPressTimeout)
      this.longPressTimeout = null
      if (!this.isRecording) {
        // Tap: take photo (only if photo mode is also enabled)
        if (Settings.config.photoMode) {
          this.recordButton.dispatchEvent(new CustomEvent('photo-capture', {bubbles:true}))
        }
      } else {
        // End recording
        this.isRecording = false
        this.updateRecordButtonState(false)
        this.recordButton.dispatchEvent(new CustomEvent('record-stop', {bubbles:true}))
      }
    } else if (Settings.config.photoMode && !Settings.config.videoMode) {
      // Only photo mode enabled - immediate photo capture on tap
      this.recordButton.dispatchEvent(new CustomEvent('photo-capture', {bubbles:true}))
    }
  }

  _handlePressCancel(e) {
    // Clean up context menu prevention
    document.removeEventListener('contextmenu', this._preventContextMenu)
    
    // Revert outline animation
  this.recordOutline.style.transform = 'translateX(-50%) scale(1)'
  this.recordOutline.style.opacity = '1'
    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout)
      this.longPressTimeout = null
    }
    if (this.isRecording) {
      this.isRecording = false
      this.updateRecordButtonState(false)
      this.recordButton.dispatchEvent(new CustomEvent('record-stop', {bubbles:true}))
    }
  }

  toggleRecordButton(isVisible) {
    if (isVisible) {
      this.recordOutline.style.display = "block"
      this.recordButton.style.display = "block"
    } else {
      this.recordOutline.style.display = "none"
      this.recordButton.style.display = "none"
    }
  }

  updateRecordButtonState(isRecording) {
    this.recordButton.style.backgroundImage = isRecording
      ? `url('${Settings.ui.recordButton.stopImage}')`
      : `url('${Settings.ui.recordButton.startImage}')`
    this.recordPressedCount++
  }

  showLoading(show) {
    this.loadingIcon.style.display = show ? "block" : "none"
  }

  displayPostRecordButtons(url, fixedBlob) {
    // Device detection
    const isAndroid = /Android/i.test(navigator.userAgent)
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
    const isDesktop = !isAndroid && !isIOS
    
    const shareButton = document.getElementById("share-button")
    const downloadButton = document.getElementById("download-button")
    
    if (shareButton && downloadButton) {
      if (isAndroid) {
        // Android: show both buttons
        shareButton.style.display = "inline-block"
        downloadButton.style.display = "inline-block"
        // Position buttons side by side
        shareButton.style.position = "absolute"
        shareButton.style.transform = "translateX(-50%)"
        shareButton.style.left = "60%"
        downloadButton.style.position = "absolute"
        downloadButton.style.transform = "translateX(-50%)"
        downloadButton.style.left = "40%"
      } else if (isIOS) {
        // iOS: only share button
        shareButton.style.display = "inline-block"
        downloadButton.style.display = "none"
        shareButton.style.position = "absolute"
        shareButton.style.transform = "translateX(-50%)"
        shareButton.style.left = "50%"
      } else {
        // Desktop: only download button
        shareButton.style.display = "none"
        downloadButton.style.display = "inline-block"
        downloadButton.style.position = "absolute"
        downloadButton.style.transform = "translateX(-50%)"
        downloadButton.style.left = "50%"
      }
    }

    // Move the back button directly into the action-buttons container
    const actionButtons = document.getElementById("action-buttons")
    const backButton = document.getElementById("back-button")
    if (actionButtons && backButton) {
      actionButtons.insertBefore(backButton, actionButtons.firstChild)
      backButton.style.height = "125px"
      backButton.style.width = "125px"
      backButton.style.left = "11.75vw"
      backButton.style.position = "relative"
      actionButtons.style.width = "100%"
      // backButton.style.display = "inline-block"
      // backButton.style.marginRight = "12px"
      // backButton.style.marginBottom = "0"
    }

    this.actionButton.style.display = "block"
    this.switchButton.style.display = "none"

    if (Settings.ui.displayPreview) {
      this.displayPreview(url)
    }

    // Determine if this is an image or video
    const isImage = typeof url === 'string' && url.startsWith('data:image/')
    const imageFileName = 'photo.png'
    const imageMimeType = 'image/png'
    const videoFileName = Settings.recording.outputFileName
    const videoMimeType = Settings.recording.mimeType

    document.getElementById("download-button").onclick = () => {
      const a = document.createElement("a")
      a.href = url
      a.download = isImage ? imageFileName : videoFileName
      a.click()
      a.remove()
    }

    document.getElementById("share-button").onclick = async () => {
      try {
        const file = new File([fixedBlob], isImage ? imageFileName : videoFileName, {
          type: isImage ? imageMimeType : videoMimeType,
        })

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: isImage ? "Photo" : "Recorded Video",
            text: isImage ? "Toi aussi deviens un pro de la construction !" : "Toi aussi deviens un pro de la construction !",
          })
          console.log("File shared successfully")
        } else {
          console.error("Sharing files is not supported on this device.")
        }
      } catch (error) {
        console.error("Error while sharing:", error)
      }
    }

    document.getElementById("back-button").onclick = async () => {
      this.actionButton.style.display = "none"
      this.backButtonContainer.style.display = "none"
      this.switchButton.style.display = "block"
      this.toggleRecordButton(true)
      if (Settings.ui.displayPreview) {
        this.removePreview()
      }
    }
  }

  updateRenderSize(source, renderTarget) {
    const width = window.innerWidth
    const height = window.innerHeight

    renderTarget.style.width = `${width}px`
    renderTarget.style.height = `${height}px`
    source.setRenderSize(width, height)
  }

  displayPreview(dataURL) {
    // Add white text below the video preview
    let previewText = document.createElement("div")
    previewText.id = "preview-lorem"
    previewText.innerHTML = `Télécharge ou partage ta photo!`
    previewText.style = `
      position: fixed;
      left: 0;
      right: 0;
      bottom: 2vh;
      color: white;
      text-align: center;
      font-size: 2em;
      font-family: sans-serif;
      z-index: 1100;
      pointer-events: none;
      line-height: 1.2;
      text-shadow: 0 2px 8px #000;
    `
    document.body.appendChild(previewText)
    // Create a fullscreen black background div
    const bg = document.createElement("div")
    bg.id = "preview-bg"
    bg.style = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: black;
      z-index: 998;
      display: flex;
      align-items: flex-start;
      justify-content: center;
    `
    document.body.appendChild(bg)

    // Create a container for the canvas to size it responsively
    const container = document.createElement("div")
    container.id = "preview-container"
    container.style = `
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;
      box-shadow: 0 0 40px 0 #000;
      border-radius: 20px;
      background: black;
      overflow: hidden;
      max-width: 76.5vw;
      max-height: 76.5vh;
      margin-top: 5vh;
    `
    bg.appendChild(container)

    let preview
    if (typeof dataURL === 'string' && dataURL.startsWith('data:image/')) {
      // Show image in preview
      preview = document.createElement('img')
      preview.src = dataURL
      preview.id = 'preview'
      preview.style = `
        display: block;
        max-width: 98%;
        max-height: calc(100% - 18px);
        margin: 0 auto;
        border-radius: 50px;
        background: black;
        border: 8px solid white;
      `
      container.appendChild(preview)
    } else {
      // Show video as a normal video element in the preview container
      preview = document.createElement("video")
      preview.src = dataURL
      preview.id = "preview"
      preview.controls = true
      preview.autoplay = true
      preview.loop = true
      preview.playsInline = true
      preview.muted = false // Allow audio to play
      preview.volume = 1.0
      // Remove fullscreen and picture-in-picture buttons
      preview.disablePictureInPicture = true
      preview.controlsList = "nofullscreen"
      preview.style = `
        display: block;
        max-width: 98%;
        max-height: calc(100% - 18px);
        margin: 0 auto;
        border-radius: 50px;
        background: black;
        border: 8px solid white;
      `
      container.appendChild(preview)
      // Add error handling for video load/playback
      preview.addEventListener('error', (e) => {
        console.error('Preview video failed to load:', e, preview.error)
      })
      preview.addEventListener('stalled', (e) => {
        console.error('Preview video stalled:', e)
      })
      preview.addEventListener('abort', (e) => {
        console.error('Preview video aborted:', e)
      })
      preview.addEventListener('emptied', (e) => {
        console.error('Preview video emptied:', e)
      })
    }
    // No canvas preview logic remains
  }

  removePreview() {
  // Remove the preview text if present
  const previewText = document.getElementById("preview-lorem")
  if (previewText) previewText.remove()
    // Restore back button position
    const backButtonContainer = document.getElementById("back-button-container")
    if (backButtonContainer) {
      backButtonContainer.style.position = "absolute"
      backButtonContainer.style.top = "2%"
      backButtonContainer.style.left = "3%"
      backButtonContainer.style.right = ""
      backButtonContainer.style.bottom = ""
      backButtonContainer.style.transform = "none"
      backButtonContainer.style.zIndex = 1000
      // Do not force display, let logic handle it
    }
    const preview = document.getElementById("preview")
    if (preview) preview.remove()
    const bg = document.getElementById("preview-bg")
    if (bg) bg.remove()
    if (preview || bg) {
      console.log("Preview removed")
    } else {
      console.log("No preview to remove")
    }
  }
}
