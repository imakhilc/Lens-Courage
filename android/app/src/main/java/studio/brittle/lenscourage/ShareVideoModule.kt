package studio.brittle.lenscourage

import android.content.Intent
import androidx.core.content.FileProvider
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File

class ShareVideoModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "LensCourageShareVideo"

  @ReactMethod
  fun share(path: String, title: String, promise: Promise) {
    try {
      val file = File(path.removePrefix("file://")).canonicalFile
      val allowedRoots =
        listOf(reactApplicationContext.filesDir, reactApplicationContext.cacheDir)
          .map { it.canonicalFile }
      val isAppPrivate =
        allowedRoots.any { root ->
          file.path == root.path || file.path.startsWith(root.path + File.separator)
        }
      if (!isAppPrivate || !file.isFile) {
        promise.reject("share-video-unavailable", "The local video could not be found.")
        return
      }

      val authority = "${reactApplicationContext.packageName}.fileprovider"
      val uri = FileProvider.getUriForFile(reactApplicationContext, authority, file)
      val sendIntent =
        Intent(Intent.ACTION_SEND).apply {
          type = "video/mp4"
          putExtra(Intent.EXTRA_STREAM, uri)
          addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
          clipData = android.content.ClipData.newRawUri("Lens Courage video", uri)
        }
      val chooser = Intent.createChooser(sendIntent, title).apply {
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      reactApplicationContext.startActivity(chooser)
      promise.resolve(null)
    } catch (error: Exception) {
      promise.reject("share-video-failed", error)
    }
  }
}
