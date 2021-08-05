import React from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { GOOGLE_MAPS_KEY } from '@env'
import { COLORS, FONTS } from '../constants/contantts'


const AddressSearch = ({ onPress, placeholder, ref, rightButton }) => {


    return (
        <GooglePlacesAutocomplete onPress={onPress} ref={ref} renderRightButton={rightButton} placeholder={placeholder} minLength={2} fetchDetails={true} debounce={400} enablePoweredByContainer={false} query={{ key: GOOGLE_MAPS_KEY, language: 'en', components: 'country:us' }} styles={{ container: { flex: 0 }, textInput: { ...FONTS.body3, borderBottomColor: COLORS.light, borderBottomWidth: 0.5 } }} />
    )
}

export default AddressSearch


