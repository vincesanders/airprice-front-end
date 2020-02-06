import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addListing, updateListing } from '../actions';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import { axiosWithAuth } from '../utils';
import './ListingForm.css';

import './ListingForm.css'

//Defaults as an edit form.
export default props => {
    const sendListingData = useDispatch();
    const hostID = useSelector(state => state.host_id);
    const [isAddingImage, setIsAddingImage] = useState(false);
    const isEditing = useSelector(state => state.isEditing);
    const [price, setPrice] = useState('');
    
    const [listing, setListing] = useState(isEditing ? 
        useSelector(state => state.listings[props.listingID]) : {
        host_id: 0,
        id: 0,
        image: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        bedrooms: 1,
        bathrooms: 1,
        beds: 1,
        deposit: 0,
        cleaningFee: 0,
        minNights: 1
    });

    const hoods = ['Reinickendorf', 'Steglitz - Zehlendorf', 'Tempelhof - Schöneberg', 'Lichtenberg', 'Spandau', 'Charlottenburg-Wilm.', 'Friedrichshain-Kreuzberg', 'Pankow', 'Treptow - Köpenick', 'Mitte', 'Marzahn - Hellersdorf', 'Neukölln'];

    const populateOptions = () => {
        let i = -1;
        return hoods.map(hood => {
            i++;
            return (<option key={i} value={hood}>{hood}</option>);
        })
    }

    const handleChange = e => {
        setListing({
            ...listing,
            [e.target.name]: e.target.value
        });
        if (isAddingImage === false && e.target.name === 'image') {
            setIsAddingImage(true);
        }
    }

    const addNewListing = e => {
        e.preventDefault();
        //send listing to store
        //get the host_id from the state
        const listingToAdd = {...listing, host_id: hostID};
        //send info to backend axiosWithAuth
        //redirect back to profile on success
        // history.push('/protected');
        //redirect back to listing form on failure with error
        // history.push('/listing-form');
        console.log(listing);
        //DO NOT SEND ID
        return sendListingData(addListing(listingToAdd));
    }

    const editListing = e => {
        e.preventDefault();
        //send info to backend with axiosWithAuth
        //redirect back to profile on success
        // history.push('/protected');
        //redirect back to listing form on failure with error
        // history.push('/listing-form');
        return sendListingData(updateListing(listing));
    }

    const getPrice = e => {
        e.preventDefault();
        const listingToAdd = {...listing, host_id: parseInt(hostID)};
        console.log('listingToAdd in getPrice in ListingForm: ', listingToAdd);
        axiosWithAuth()
            .post(`api/restricted/listings/getQuote`, listingToAdd)
            .then(res => {
                setPrice(res.data.resource.price);
                console.log('This is res.data.resource in getPrice func in ListingForm: ', res.data.resource)
            }).catch(err => console.log(err));
    }

    //TODO: set up regex patterns
    return (
        <div className='listing-form-background'>
        <div className='form-container'>
            <form onSubmit={isEditing ? editListing : addNewListing} >
                <div className="blur">
                {/* Option to upload image? */}
                <h2>Tell us about your listing.</h2>
                <p>In order to get the best results fill out as many of the fields as you can and be as accurate as possible.</p>
                <div className='form-group'>
                    <label>Listing Image</label>
                    <input type='url' name='image' placeholder='image url...' onChange={handleChange} value={listing.image} />
                </div>
                <div className='image-wrapper'>
                    {isAddingImage ? (<img src={listing.image} alt='No Image Found' />) : (<h3>Image Appears Here</h3>)}
                </div>
                <div className='form-group'>
                    <label>Neighborhood</label>
                    <select name='neighborhood' onChange={handleChange} >
                        {populateHoodOptions()}
                    </select>
                </div>
                
                <div className='form-group'>
                    <label>Room Type</label>
                    <select name='room_type' onChange={handleChange} >
                        {populateRoomTypeOptions()}
                    </select>
                </div>
                
                <div className='form-group'>
                    <label>How many bedrooms?</label>
                    <input type='number' name='bedrooms' placeholder='Number of bedrooms...' onChange={handleChange} value={listing.bedrooms} />
                </div>
                
                <div className='form-group'>
                    <label>How many bathrooms?</label>
                    <input type='number' name='bathrooms' placeholder='Number of bathrooms...' onChange={handleChange} value={listing.bathrooms} />
                </div>
                
                <div className='form-group'>
                    <label>How many beds?</label>
                    <input type='number' name='beds' placeholder='Number of beds...' onChange={handleChange} value={listing.beds} />
                </div>

                <div className='form-group'>
                    <label>Security Deposit</label>
                    <input type='number' name='deposit' placeholder='Security Deposit' onChange={handleChange} value={listing.deposit} />
                </div>
                
                <div className='form-group'>
                    <label>Cleaning Fee</label>
                    <input type='number' name='cleaning_fee' placeholder='Cleaning Fee' onChange={handleChange} value={listing.cleaning_fee} />
                </div>
                
                <div className='form-group'>
                    <label>Minimum Nights Stay</label>
                    <input type='number' name='min_nights' placeholder='Minimum Nights Stay' onChange={handleChange} value={listing.min_nights} />
                </div>
                <div className='button-container'>
                    {isEditing ? (<button type='submit'>Commit Changes</button>) : (<button type='submit'>Add Listing</button>)}
                    <button onClick={getPrice}>Get AirPrice</button>
                </div>        
            </form>
            
            </div>
        </div>
        </div>
    );
}