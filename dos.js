/**
 * DOS (Disk Operating System) Module for Qandy
 * 
 * Provides file save, load, and list functionality using localStorage.
 * 
 * Design Decisions:
 * -----------------
 * 1. File Format: JSON
 *    - Easy to parse and serialize
 *    - Supports metadata (timestamp, size, type)
 *    - Future extensible for permissions, etc.
 * 
 * 2. Storage Structure:
 *    - Files stored with prefix "qandy_file_" + filename
 *    - File index stored in "qandy_files_index" for fast listing
 *    - Each file is a JSON object with: {content, timestamp, size, type}
 * 
 * 3. User Perspective:
 *    - Simple commands: SAVE, LOAD, DIR, DELETE
 *    - Filenames must end in .js (enforced for safety)
 *    - Clear error messages
 *    - Human-readable file listings
 * 
 * 4. Developer Perspective:
 *    - Clean API: DOS.save(), DOS.load(), DOS.list(), DOS.delete()
 *    - Returns consistent result objects: {success, data, error}
 *    - Validates inputs
 *    - Handles localStorage errors gracefully
 */

var DOS = (function() {
  'use strict';
  
  // Constants
  const FILE_PREFIX = "qandy_file_";
  const INDEX_KEY = "qandy_files_index";
  const MAX_FILENAME_LENGTH = 50;
  const ALLOWED_EXTENSIONS = ['.js', '.txt'];
  
  /**
   * Initialize the file index if it doesn't exist
   */
  function initIndex() {
    if (!localStorage.getItem(INDEX_KEY)) {
      localStorage.setItem(INDEX_KEY, JSON.stringify([]));
    }
  }
  
  /**
   * Get the file index
   * @returns {Array} Array of filenames
   */
  function getIndex() {
    initIndex();
    try {
      return JSON.parse(localStorage.getItem(INDEX_KEY)) || [];
    } catch (e) {
      console.error("Error parsing file index:", e);
      return [];
    }
  }
  
  /**
   * Update the file index
   * @param {Array} index - New index array
   */
  function saveIndex(index) {
    try {
      localStorage.setItem(INDEX_KEY, JSON.stringify(index));
      return true;
    } catch (e) {
      console.error("Error saving file index:", e);
      return false;
    }
  }
  
  /**
   * Validate a filename
   * @param {string} filename - Filename to validate
   * @returns {Object} {valid: boolean, error: string}
   */
  function validateFilename(filename) {
    if (!filename || typeof filename !== 'string') {
      return {valid: false, error: "Filename is required"};
    }
    
    filename = filename.trim();
    
    if (filename.length === 0) {
      return {valid: false, error: "Filename cannot be empty"};
    }
    
    if (filename.length > MAX_FILENAME_LENGTH) {
      return {valid: false, error: `Filename too long (max ${MAX_FILENAME_LENGTH} characters)`};
    }
    
    // Check for invalid characters
    if (/[<>:"|?*\x00-\x1F]/.test(filename)) {
      return {valid: false, error: "Filename contains invalid characters"};
    }
    
    // Check for allowed extensions
    const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => filename.endsWith(ext));
    if (!hasValidExtension) {
      return {valid: false, error: `Filename must end with ${ALLOWED_EXTENSIONS.join(' or ')}`};
    }
    
    return {valid: true, filename: filename};
  }
  
  /**
   * Format file size for display
   * @param {number} bytes - Size in bytes
   * @returns {string} Formatted size string
   */
  function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }
  
  /**
   * Format timestamp for display
   * @param {number} timestamp - Unix timestamp
   * @returns {string} Formatted date string
   */
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
  
  // Public API
  return {
    /**
     * Save a file to localStorage
     * @param {string} filename - Name of the file
     * @param {string} content - File content
     * @returns {Object} {success: boolean, data: object, error: string}
     */
    save: function(filename, content) {
      // Validate filename
      const validation = validateFilename(filename);
      if (!validation.valid) {
        return {success: false, error: validation.error};
      }
      filename = validation.filename;
      
      // Validate content
      if (typeof content !== 'string') {
        return {success: false, error: "Content must be a string"};
      }
      
      // Create file object
      const fileData = {
        content: content,
        timestamp: Date.now(),
        size: content.length,
        type: filename.endsWith('.js') ? 'javascript' : 'text'
      };
      
      try {
        // Save file
        localStorage.setItem(FILE_PREFIX + filename, JSON.stringify(fileData));
        
        // Update index
        const index = getIndex();
        if (!index.includes(filename)) {
          index.push(filename);
          index.sort(); // Keep alphabetically sorted
          saveIndex(index);
        }
        
        return {
          success: true,
          data: {
            filename: filename,
            size: fileData.size,
            timestamp: fileData.timestamp
          }
        };
      } catch (e) {
        if (e.name === 'QuotaExceededError') {
          return {success: false, error: "Storage quota exceeded"};
        }
        return {success: false, error: "Error saving file: " + e.message};
      }
    },
    
    /**
     * Load a file from localStorage
     * @param {string} filename - Name of the file to load
     * @returns {Object} {success: boolean, data: object, error: string}
     */
    load: function(filename) {
      // Validate filename
      const validation = validateFilename(filename);
      if (!validation.valid) {
        return {success: false, error: validation.error};
      }
      filename = validation.filename;
      
      try {
        const fileDataStr = localStorage.getItem(FILE_PREFIX + filename);
        if (!fileDataStr) {
          return {success: false, error: "File not found: " + filename};
        }
        
        const fileData = JSON.parse(fileDataStr);
        return {
          success: true,
          data: {
            filename: filename,
            content: fileData.content,
            timestamp: fileData.timestamp,
            size: fileData.size,
            type: fileData.type
          }
        };
      } catch (e) {
        return {success: false, error: "Error loading file: " + e.message};
      }
    },
    
    /**
     * List all files in localStorage
     * @returns {Object} {success: boolean, data: array, error: string}
     */
    list: function() {
      try {
        const index = getIndex();
        const files = [];
        
        for (let i = 0; i < index.length; i++) {
          const filename = index[i];
          const fileDataStr = localStorage.getItem(FILE_PREFIX + filename);
          if (fileDataStr) {
            try {
              const fileData = JSON.parse(fileDataStr);
              files.push({
                filename: filename,
                size: fileData.size,
                timestamp: fileData.timestamp,
                type: fileData.type,
                formattedSize: formatSize(fileData.size),
                formattedDate: formatDate(fileData.timestamp)
              });
            } catch (e) {
              // Skip corrupted files
              console.error("Error parsing file:", filename, e);
            }
          }
        }
        
        return {success: true, data: files};
      } catch (e) {
        return {success: false, error: "Error listing files: " + e.message};
      }
    },
    
    /**
     * Delete a file from localStorage
     * @param {string} filename - Name of the file to delete
     * @returns {Object} {success: boolean, error: string}
     */
    delete: function(filename) {
      // Validate filename
      const validation = validateFilename(filename);
      if (!validation.valid) {
        return {success: false, error: validation.error};
      }
      filename = validation.filename;
      
      try {
        // Check if file exists
        if (!localStorage.getItem(FILE_PREFIX + filename)) {
          return {success: false, error: "File not found: " + filename};
        }
        
        // Delete file
        localStorage.removeItem(FILE_PREFIX + filename);
        
        // Update index
        const index = getIndex();
        const newIndex = index.filter(f => f !== filename);
        saveIndex(newIndex);
        
        return {success: true};
      } catch (e) {
        return {success: false, error: "Error deleting file: " + e.message};
      }
    },
    
    /**
     * Check if a file exists
     * @param {string} filename - Name of the file to check
     * @returns {boolean} True if file exists
     */
    exists: function(filename) {
      const validation = validateFilename(filename);
      if (!validation.valid) {
        return false;
      }
      filename = validation.filename;
      return localStorage.getItem(FILE_PREFIX + filename) !== null;
    },
    
    /**
     * Get storage statistics
     * @returns {Object} Storage usage information
     */
    stats: function() {
      try {
        const index = getIndex();
        let totalSize = 0;
        
        for (let i = 0; i < index.length; i++) {
          const filename = index[i];
          const fileDataStr = localStorage.getItem(FILE_PREFIX + filename);
          if (fileDataStr) {
            totalSize += fileDataStr.length;
          }
        }
        
        return {
          success: true,
          data: {
            fileCount: index.length,
            totalSize: totalSize,
            formattedSize: formatSize(totalSize)
          }
        };
      } catch (e) {
        return {success: false, error: "Error getting stats: " + e.message};
      }
    }
  };
})();

// Export for use in qandy2.htm
if (typeof window !== 'undefined') {
  window.DOS = DOS;
}
