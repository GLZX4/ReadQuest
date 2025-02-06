import React, { useState } from "react";
import '../styles/addschool.css';
import axios from 'axios';

function AddSchool() {
    const [newSchool, setNewSchool] = useState({
        schoolName: '',
        schoolCode: '',
        address: '',
        contactEmail: '',
        contactPhone: ''
    });

    const addSchool = async (schoolData) => {
        const token = localStorage.getItem('token');
      
        try {
          const response = await axios.post('http://localhost:5000/api/admin/addSchool', schoolData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('School Added:', response.data);
          return response.data;
        } catch (error) {
          console.error('Error adding school:', error.response?.data || error.message);
          throw error;
        }
      };
      

    const SchoolSubmit = (e) => {
        e.preventDefault(); 
        addSchool(newSchool);
    }

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setNewSchool((prevState) => ({
            ...prevState,
            [id]: value
        }));
    };
    
    return (
        <form className='add-school' onSubmit={SchoolSubmit}>
            <div className='input-Group'>
                <label htmlFor='schoolName'>School Name:</label>
                <input
                    type='text'
                    id='schoolName'
                    value={newSchool.schoolName}
                    onChange={handleInputChange}
                />
            </div>
            <div className='input-Group'>
                <label htmlFor='schoolCode'>School Code:</label>
                <input
                    type='text'
                    id='schoolCode'
                    value={newSchool.schoolCode}
                    onChange={handleInputChange}
                />
            </div>
            <div className='input-Group'>
                <label htmlFor='address'>Address:</label>
                <input
                    type='text'
                    id='address'
                    value={newSchool.address}
                    onChange={handleInputChange}
                />
            </div>
            <div className='input-Group'>
                <label htmlFor='contactEmail'>Contact Email:</label>
                <input
                    type='email'
                    id='contactEmail'
                    value={newSchool.contactEmail}
                    onChange={handleInputChange}
                />
            </div>
            <div className='input-Group'>
                <label htmlFor='contactPhone'>Contact Phone:</label>
                <input
                    type='tel'
                    id='contactPhone'
                    value={newSchool.contactPhone}
                    onChange={handleInputChange}
                />
            </div>
            <button type='submit'>Add School</button>
        </form>
    )
}

export default AddSchool;