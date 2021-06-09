import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ref } from 'yup';
import { SIZES } from '../../constants/contantts';
import AddReferralModal from '../modals/AddReferralModal';

const EditReferral = ({ route, navigation }) => {
    const { referral } = route.params;
    const [visible, setVisible] = useState(true)

    const inititalValues = {
        name: referral.name,
        address: referral.address,
        apt: referral.apt,
        city: referral.city,
        state: referral.state,
        zipcode: referral.zipcode,
        referee: referral.referee,
        manager: referral.manager,
        moveIn: referral.moveIn,
        phone: referral.phone,
        comment: referral.comment,
        status: referral.status,
        mon: referral.mon,
        due_date: referral.due_date,
        order_date: referral.order_date,
        id: referral.id

    }

    return (
        <View style={styles.view}>
            <Text>Edit Referral</Text>
            <AddReferralModal visible={visible} edit={true} setVisible={setVisible} initialValues={inititalValues} />
        </View>
    )
}

export default EditReferral

const styles = StyleSheet.create({
    view: {

    }
})
