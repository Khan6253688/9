import React, { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useDeliveryStore } from '../store/deliveryStore'
import { useNavigate } from 'react-router-dom'
import './AvailableDeliveries.css'

function AvailableDeliveries() {
  const { token, user } = useAuthStore()
  const navigate = useNavigate()
  const { availableDeliveries, fetchAvailableDeliveries, acceptDelivery, isLoading } = useDeliveryStore()
  const [accepting, setAccepting] = React.useState(null)

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    if (user?.role !== 'driver') {
      navigate('/dashboard')
      return
    }
    fetchAvailableDeliveries(token)
  }, [token, user, fetchAvailableDeliveries, navigate])

  const handleAccept = async (deliveryId) => {
    setAccepting(deliveryId)
    try {
      await acceptDelivery(deliveryId, token)
      alert('Delivery accepted successfully!')
    } catch (error) {
      alert('Failed to accept delivery')
    } finally {
      setAccepting(null)
    }
  }

  return (
    <div className="available-deliveries">
      <div className="container">
        <h1>Available Gigs</h1>
        <p className="subtitle">Accept deliveries and earn Rs per gig</p>

        {isLoading ? (
          <div className="loading">Loading deliveries...</div>
        ) : availableDeliveries.length === 0 ? (
          <div className="no-deliveries">
            <p>No deliveries available right now. Check back soon!</p>
          </div>
        ) : (
          <div className="deliveries-grid">
            {availableDeliveries.map((delivery) => (
              <div key={delivery._id} className="delivery-card">
                <div className="card-header">
                  <span className={`urgent-badge ${delivery.isUrgent ? 'active' : ''}`}>
                    {delivery.isUrgent ? '🚀 URGENT' : 'Normal'}
                  </span>
                  <span className="distance-badge">{delivery.distance} km</span>
                </div>

                <div className="card-content">
                  <div className="location-info">
                    <h3>📍 Pickup</h3>
                    <p>{delivery.pickupLocation?.address || 'Pickup Location'}</p>
                  </div>

                  <div className="location-info">
                    <h3>📦 Delivery</h3>
                    <p>{delivery.deliveryLocation?.address || 'Delivery Location'}</p>
                  </div>

                  <div className="delivery-details">
                    <div className="detail-item">
                      <span>Weight</span>
                      <strong>{delivery.weight}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Est. Time</span>
                      <strong>{delivery.estimatedTime} min</strong>
                    </div>
                    <div className="detail-item">
                      <span>Customer</span>
                      <strong>⭐ {delivery.customerId?.rating || 'N/A'}</strong>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <div className="price-section">
                    <p className="label">Earning</p>
                    <p className="price">Rs {delivery.totalPrice}</p>
                  </div>
                  <button
                    onClick={() => handleAccept(delivery._id)}
                    disabled={accepting === delivery._id}
                    className="btn btn-accept"
                  >
                    {accepting === delivery._id ? 'Accepting...' : 'Accept Gig'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AvailableDeliveries
