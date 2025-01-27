import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PractitionerList() {
  const [practitioners, setPractitioners] = useState([]);

  useEffect(() => {
    // Fetch practitioners
    const fetchPractitioners = async () => {
      try {
        const response = await axios.get('https://lyfchat.onrender.com/api/practitioners/list');
        setPractitioners(response.data);
      } catch (error) {
        console.error('Error fetching practitioners:', error);
      }
    };

    fetchPractitioners();
  }, []);

  const handlePayAndChat = async (practitioner) => {
    // Redirect to Paystack payment
    try {
      const response = await axios.post('https://lyfchat.onrender.com/api/payments/initiate', {
        practitionerId: practitioner._id,
        fee: practitioner.consultationFee,
      });
      window.location.href = response.data.paymentUrl; // Redirect to Paystack
    } catch (error) {
      console.error('Payment initiation failed:', error);
    }
  };

  return (
    <div>
      <h1>Health Practitioners</h1>
      <ul>
        {practitioners.map((practitioner) => (
          <li key={practitioner._id}>
            <p>Name: {practitioner.name}</p>
            <p>Field: {practitioner.field}</p>
            <p>Consultation Fee: ₦{practitioner.consultationFee}</p>
            <button onClick={() => handlePayAndChat(practitioner)}>
              Pay and Chat
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PractitionerList;
