import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useDeliveryStore } from '../store/deliveryStore'
import './DeliveryTracking.css'

function DeliveryTracking() {
  const { id } = useParams()
  const { token, user } = useAuthStore()
  const navigate = useNavigate()
  const { currentDelivery, fetchDeliveryDetails, updateDeliveryStatus, isLoading } = useDeliveryStore()
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchDeliveryDetails(id, token)
  }, [id, token, fetchDeliveryDetails, navigate])

  const handleStatusUpdate = async (newStatus) => {
    setUpdatingStatus(true)
    try {
      await updateDeliveryStatus(id, newStatus, token)
      alert('Status updated successfully!')
    } catch (error) {
      alert('Failed to update status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const statusSteps = ['pending', 'accepted', 'on_the_way', 'delivered']
  const currentStatusIndex = currentDelivery ? statusSteps.indexOf(currentDelivery.status) : -1

  if (isLoading) {
    return <div className="container" style={{ padding: '2rem 0' }}>Loading delivery details...</div>
  }

  if (!currentDelivery) {
    return <div className="container" style={{ padding: '2rem 0' }}>Delivery not found</div>
  }

  return (
    <div className="delivery-tracking">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-btn">← Back</button>

        <div className="tracking-header">
          <h1>Delivery Tracking</h1>
          <p className="delivery-id">ID: {currentDelivery.deliveryId}</p>
        </div>

        <div className="tracking-layout">
          <div className="tracking-timeline">
            <h2>Delivery Status</h2>
            <div className="timeline">
              {statusSteps.map((status, index) => (
                <div key={status} className="timeline-item">
                  <div className={`timeline-dot ${index <= currentStatusIndex ? 'completed' : ''}`}></div>
                  <div className="timeline-content">
                    <p className="status-name">{status.replace('_', ' ').toUpperCase()}</p>
                    {index <= currentStatusIndex && <p className="status-time">✓ Completed</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="tracking-details">
            <div className="detail-section">
              <h3>Pickup Location</h3>
              <p className="location">{currentDelivery.pickupLocation?.address}</p>
            </div>

            <div className="detail-section">
              <h3>Delivery Location</h3>
              <p className="location">{currentDelivery.deliveryLocation?.address}</p>
            </div>

            <div className="detail-row">
              <div className="detail-section">
                <h3>Distance</h3>
                <p>{currentDelivery.distance} km</p>
              </div>
              <div className="detail-section">
                <h3>Weight</h3>
                <p>{currentDelivery.weight}</p>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-section">
                <h3>Base Price</h3>
                <p>Rs {currentDelivery.basePrice}</p>
              </div>
              {currentDelivery.urgentCharge > 0 && (
                <div className="detail-section">
                  <h3>Urgent Fee</h3>
                  <p>Rs {currentDelivery.urgentCharge}</p>
                </div>
              )}
              <div className="detail-section">
                <h3>Total Price</h3>
                <p className="total-price">Rs {currentDelivery.totalPrice}</p>
              </div>
            </div>

            {currentDelivery.driverId && (
              <div className="detail-section">
                <h3>Driver</h3>
                <p>{currentDelivery.driverId?.name} (⭐ {currentDelivery.driverId?.rating})</p>
                <p className="driver-phone">{currentDelivery.driverId?.phone}</p>
              </div>
            )}

            <div className="detail-section">
              <h3>Payment Status</h3>
              <p className={`payment-status ${currentDelivery.paymentStatus}`}>
                {currentDelivery.paymentStatus.toUpperCase()}
              </p>
            </div>

            {(user?._id === currentDelivery.driverId?._id || user?.role === 'admin') && currentDelivery.status !== 'delivered' && currentDelivery.status !== 'cancelled' && (
              <div className="action-buttons">
                {currentDelivery.status === 'accepted' && (
                  <button
                    onClick={() => handleStatusUpdate('on_the_way')}
                    disabled={updatingStatus}
                    className="btn btn-primary"
                  >
                    Start Delivery
                  </button>
                )}
                {currentDelivery.status === 'on_the_way' && (
                  <button
                    onClick={() => handleStatusUpdate('delivered')}
                    disabled={updatingStatus}
                    className="btn btn-success"
                  >
                    Mark as Delivered
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeliveryTracking
