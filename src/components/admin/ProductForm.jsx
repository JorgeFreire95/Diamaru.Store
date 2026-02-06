import { useState, useEffect } from 'react'
import './ProductForm.css'
import axios from 'axios'

function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'painting',
    image_url: '',
    file_url: ''
  })

  const [errors, setErrors] = useState({})
  const [uploading, setUploading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [pdfFile, setPdfFile] = useState(null)
  const [pdfFileName, setPdfFileName] = useState(null)

  useEffect(() => {
    if (product) {
      setFormData(product)
      setPreviewUrl(product.image_url)
    }
  }, [product])

  const validate = () => {
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = 'El título es requerido'
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida'
    if (!formData.price || formData.price <= 0) newErrors.price = 'El precio debe ser mayor a 0'
    if (!formData.image_url.trim() && !imageFile) newErrors.image_url = 'La imagen es requerida'

    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar que sea imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona una imagen válida (JPG, PNG, GIF, etc)')
        return
      }

      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no puede pesar más de 5MB')
        return
      }

      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePdfChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar que sea PDF
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        alert('Por favor selecciona un archivo PDF válido')
        return
      }

      // Validar tamaño (máx 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('El PDF no puede pesar más de 50MB')
        return
      }

      setPdfFile(file)
      setPdfFileName(file.name)
    }
  }

  const uploadImage = async () => {
    if (!imageFile) return

    setUploading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('file', imageFile)

      const token = localStorage.getItem('admin_token')
      const response = await axios.post(
        'http://localhost:8000/admin/upload-image',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      )

      setFormData(prev => ({
        ...prev,
        image_url: response.data.url
      }))

      setImageFile(null)
      alert('✅ Imagen subida exitosamente')
      
      return true
    } catch (error) {
      console.error('Error al subir imagen:', error)
      alert('❌ Error al subir la imagen: ' + (error.response?.data?.detail || error.message))
      return false
    } finally {
      setUploading(false)
    }
  }

  const uploadBook = async () => {
    if (!pdfFile) return true // Si no hay PDF, continuar

    setUploading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('file', pdfFile)

      const token = localStorage.getItem('admin_token')
      const response = await axios.post(
        'http://localhost:8000/admin/upload-book',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      )

      setFormData(prev => ({
        ...prev,
        file_url: response.data.url
      }))

      setPdfFile(null)
      setPdfFileName(null)
      alert('✅ PDF subido exitosamente')
      
      return true
    } catch (error) {
      console.error('Error al subir PDF:', error)
      alert('❌ Error al subir el PDF: ' + (error.response?.data?.detail || error.message))
      return false
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Si hay una imagen nueva, subirla primero
    if (imageFile) {
      const success = await uploadImage()
      if (!success) return
    }

    // Si hay un PDF nuevo, subirlo
    if (pdfFile) {
      const success = await uploadBook()
      if (!success) return
    }

    const newErrors = validate()

    if (Object.keys(newErrors).length === 0) {
      onSave(formData)
      setFormData({
        title: '',
        description: '',
        price: '',
        category: 'painting',
        image_url: '',
        file_url: ''
      })
      setImageFile(null)
      setPreviewUrl(null)
      setPdfFile(null)
      setPdfFileName(null)
    } else {
      setErrors(newErrors)
    }
  }

  return (
    <div className="product-form">
      <h2>{product ? '✏️ Editar Producto' : '➕ Crear Nuevo Producto'}</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ej: El Grito"
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe el producto"
            rows="4"
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Categoría *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="painting">🖼️ Cuadro</option>
              <option value="book">📚 Libro PDF</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="price">Precio ($) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={errors.price ? 'error' : ''}
            />
            {errors.price && <span className="error-text">{errors.price}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="image_file">Imagen del Producto *</label>
          <input
            type="file"
            id="image_file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
          />
          <small>Selecciona una imagen JPG, PNG o GIF (máximo 5MB)</small>
          {formData.image_url && !imageFile && (
            <div className="image-status">
              ✅ Imagen actual cargada
            </div>
          )}
          {errors.image_url && <span className="error-text">{errors.image_url}</span>}
          {previewUrl && (
            <div className="image-preview">
              <img src={previewUrl} alt="Preview" />
            </div>
          )}
        </div>

        {formData.category === 'book' && (
          <div className="form-group">
            <label htmlFor="pdf_file">📄 Archivo PDF del Libro</label>
            <input
              type="file"
              id="pdf_file"
              accept=".pdf"
              onChange={handlePdfChange}
              className="file-input"
            />
            <small>Selecciona un archivo PDF (máximo 50MB)</small>
            {formData.file_url && !pdfFile && (
              <div className="file-status">
                ✅ PDF actual cargado
              </div>
            )}
            {pdfFileName && (
              <div className="file-status">
                📄 {pdfFileName}
              </div>
            )}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={uploading}>
            {uploading ? '⏳ Subiendo...' : (product ? '💾 Actualizar' : '✅ Crear Producto')}
          </button>
          <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={uploading}>
            ❌ Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm
