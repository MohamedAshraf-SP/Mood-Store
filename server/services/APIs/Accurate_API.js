import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Accurate API Configuration
const ACCURATE_API_URL = process.env.ACCURATE_API_URL || 'https://api.accurate-ss.com/graphql';
const ACCURATE_USERNAME = process.env.ACCURATE_USERNAME;
const ACCURATE_PASSWORD = process.env.ACCURATE_PASSWORD;

let authToken = null;

/**
 * Authenticate with Accurate API and get access token
 */
export const authenticateAccurate = async () => {
    const loginMutation = `
        mutation Login($input: LoginInput!) {
            login(input: $input) {
                user {
                    id
                    name
                    email
                }
                token
            }
        }
    `;

    try {
        const response = await axios.post(ACCURATE_API_URL, {
            query: loginMutation,
            variables: {
                input: {
                    username: ACCURATE_USERNAME,
                    password: ACCURATE_PASSWORD
                }
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data.errors) {
            throw new Error(`Authentication failed: ${JSON.stringify(response.data.errors)}`);
        }

        authToken = response.data.data.login.token;
        return authToken;
    } catch (error) {
        console.error('Accurate API Authentication Error:', error.message);
        throw error;
    }
};

/**
 * Ensure we have a valid auth token
 */
const ensureAuthenticated = async () => {
    if (!authToken) {
        await authenticateAccurate();
    }
    return authToken;
};

/**
 * Calculate shipping fees for a shipment
 */
export const calculateShipmentFees = async (shipmentData) => {
    await ensureAuthenticated();

    const calculateFeesQuery = `
        query CalculateShipmentFees($input: CalculateShipmentFeesInput!) {
            calculateShipmentFees(input: $input) {
                totalFees
                shippingFees
                codFees
                insurance
                tax
                discount
            }
        }
    `;

    try {
        const response = await axios.post(ACCURATE_API_URL, {
            query: calculateFeesQuery,
            variables: {
                input: {
                    fromZoneId: shipmentData.fromZoneId,
                    toZoneId: shipmentData.toZoneId,
                    weight: shipmentData.weight,
                    codAmount: shipmentData.codAmount || 0,
                    packageCount: shipmentData.packageCount || 1
                }
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.data.errors) {
            throw new Error(`Fee calculation failed: ${JSON.stringify(response.data.errors)}`);
        }

        return response.data.data.calculateShipmentFees;
    } catch (error) {
        console.error('Accurate API Calculate Fees Error:', error.message);
        throw error;
    }
};

/**
 * Create/Save a shipment
 */
export const saveShipment = async (shipmentData) => {
    await ensureAuthenticated();

    const saveShipmentMutation = `
        mutation SaveShipment($input: ShipmentInput!) {
            saveShipment(input: $input) {
                id
                trackingNumber
                referenceNumber
                status
                fees {
                    totalFees
                    shippingFees
                    codFees
                }
                createdAt
            }
        }
    `;

    try {
        const response = await axios.post(ACCURATE_API_URL, {
            query: saveShipmentMutation,
            variables: {
                input: {
                    referenceNumber: shipmentData.referenceNumber,

                    // Sender Information
                    senderName: shipmentData.sender.name,
                    senderPhone: shipmentData.sender.phone,
                    senderAddress: shipmentData.sender.address,
                    senderCity: shipmentData.sender.city,
                    senderZone: shipmentData.sender.zone,

                    // Receiver Information
                    receiverName: shipmentData.receiver.name,
                    receiverPhone: shipmentData.receiver.phone,
                    receiverPhone2: shipmentData.receiver.alternatePhone || null,
                    receiverAddress: shipmentData.receiver.address,
                    receiverCity: shipmentData.receiver.city,
                    receiverZone: shipmentData.receiver.zone,

                    // Shipment Details
                    packageCount: shipmentData.packageCount || 1,
                    weight: shipmentData.weight,
                    description: shipmentData.description || '',
                    notes: shipmentData.notes || '',

                    // Payment Information
                    paymentType: shipmentData.paymentType || 'PREPAID', // PREPAID, COD, CREDIT
                    codAmount: shipmentData.codAmount || 0,
                    declaredValue: shipmentData.declaredValue || 0,

                    // Service Type
                    serviceType: shipmentData.serviceType || 'STANDARD', // STANDARD, EXPRESS

                    // Additional Options
                    allowOpenPackage: shipmentData.allowOpenPackage || false,
                    fragile: shipmentData.fragile || false
                }
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.data.errors) {
            // Try re-authenticating if token expired
            if (response.data.errors[0]?.message?.includes('Unauthenticated')) {
                authToken = null;
                return await saveShipment(shipmentData);
            }
            throw new Error(`Save shipment failed: ${JSON.stringify(response.data.errors)}`);
        }

        return response.data.data.saveShipment;
    } catch (error) {
        console.error('Accurate API Save Shipment Error:', error.message);
        throw error;
    }
};

/**
 * Get shipment details by tracking number
 */
export const getShipment = async (trackingNumber) => {
    await ensureAuthenticated();

    const shipmentQuery = `
        query GetShipment($trackingNumber: String!) {
            shipment(trackingNumber: $trackingNumber) {
                id
                trackingNumber
                referenceNumber
                status
                senderName
                senderPhone
                senderAddress
                receiverName
                receiverPhone
                receiverAddress
                packageCount
                weight
                description
                paymentType
                codAmount
                fees {
                    totalFees
                    shippingFees
                    codFees
                }
                timeline {
                    status
                    location
                    notes
                    timestamp
                }
                createdAt
                updatedAt
            }
        }
    `;

    try {
        const response = await axios.post(ACCURATE_API_URL, {
            query: shipmentQuery,
            variables: { trackingNumber }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.data.errors) {
            throw new Error(`Get shipment failed: ${JSON.stringify(response.data.errors)}`);
        }

        return response.data.data.shipment;
    } catch (error) {
        console.error('Accurate API Get Shipment Error:', error.message);
        throw error;
    }
};

/**
 * List shipments with filters
 */
export const listShipments = async (filters = {}) => {
    await ensureAuthenticated();

    const listShipmentsQuery = `
        query ListShipments($filter: ListShipmentsFilterInput, $page: Int, $perPage: Int) {
            listShipments(filter: $filter, page: $page, perPage: $perPage) {
                data {
                    id
                    trackingNumber
                    referenceNumber
                    status
                    receiverName
                    receiverPhone
                    codAmount
                    createdAt
                }
                paginatorInfo {
                    currentPage
                    lastPage
                    total
                    perPage
                }
            }
        }
    `;

    try {
        const response = await axios.post(ACCURATE_API_URL, {
            query: listShipmentsQuery,
            variables: {
                filter: {
                    status: filters.status || null,
                    referenceNumber: filters.referenceNumber || null,
                    trackingNumber: filters.trackingNumber || null,
                    receiverPhone: filters.receiverPhone || null,
                    dateFrom: filters.dateFrom || null,
                    dateTo: filters.dateTo || null
                },
                page: filters.page || 1,
                perPage: filters.perPage || 20
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.data.errors) {
            throw new Error(`List shipments failed: ${JSON.stringify(response.data.errors)}`);
        }

        return response.data.data.listShipments;
    } catch (error) {
        console.error('Accurate API List Shipments Error:', error.message);
        throw error;
    }
};

/**
 * Get available countries
 */
export const getCountries = async () => {
    await ensureAuthenticated();

    const countriesQuery = `
        query {
            countries {
                id
                name
                code
            }
        }
    `;

    try {
        const response = await axios.post(ACCURATE_API_URL, {
            query: countriesQuery
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });

        return response.data.data.countries;
    } catch (error) {
        console.error('Accurate API Get Countries Error:', error.message);
        throw error;
    }
};

/**
 * Get available zones for a city
 */
export const getZones = async (cityId) => {
    await ensureAuthenticated();

    const zonesQuery = `
        query GetZones($cityId: ID!) {
            zones(cityId: $cityId) {
                id
                name
                code
                city {
                    id
                    name
                }
            }
        }
    `;

    try {
        const response = await axios.post(ACCURATE_API_URL, {
            query: zonesQuery,
            variables: { cityId }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });

        return response.data.data.zones;
    } catch (error) {
        console.error('Accurate API Get Zones Error:', error.message);
        throw error;
    }
};

/**
 * Cancel a shipment
 */
export const cancelShipment = async (trackingNumber, reason) => {
    await ensureAuthenticated();

    const cancelMutation = `
        mutation CancelShipment($trackingNumber: String!, $reason: String) {
            cancelShipment(trackingNumber: $trackingNumber, reason: $reason) {
                id
                trackingNumber
                status
                updatedAt
            }
        }
    `;

    try {
        const response = await axios.post(ACCURATE_API_URL, {
            query: cancelMutation,
            variables: {
                trackingNumber,
                reason: reason || 'Cancelled by customer'
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.data.errors) {
            throw new Error(`Cancel shipment failed: ${JSON.stringify(response.data.errors)}`);
        }

        return response.data.data.cancelShipment;
    } catch (error) {
        console.error('Accurate API Cancel Shipment Error:', error.message);
        throw error;
    }
};

/**
 * Generate Accurate shipping request body from order data
 */
export const generateAccurateShipmentData = (orderData) => {
    return {
        referenceNumber: orderData.billCode || orderData.txlogisticId,

        sender: {
            name: orderData.sender?.name || 'Mood Store',
            phone: orderData.sender?.phone || orderData.sender?.mobile,
            address: `${orderData.sender?.street || ''} ${orderData.sender?.building || ''} ${orderData.sender?.floor || ''}`.trim(),
            city: orderData.sender?.city || orderData.sender?.prov,
            zone: orderData.sender?.area
        },

        receiver: {
            name: orderData.receiver?.name,
            phone: orderData.receiver?.phone || orderData.receiver?.mobile,
            alternatePhone: orderData.receiver?.alternateReceiverPhoneNo,
            address: `${orderData.receiver?.street || ''} ${orderData.receiver?.building || ''} ${orderData.receiver?.floor || ''} ${orderData.receiver?.flats || ''}`.trim() || orderData.receiver?.address,
            city: orderData.receiver?.city || orderData.receiver?.prov,
            zone: orderData.receiver?.area
        },

        packageCount: parseInt(orderData.totalQuantity) || 1,
        weight: orderData.weight || 1,
        description: orderData.items?.map(item => item.itemName || item.englishName).join(', ') || 'General Goods',
        notes: orderData.remark || '',

        paymentType: orderData.payType === 'PP_CASH' ? 'COD' : 'PREPAID',
        codAmount: orderData.payType === 'PP_CASH' ? parseFloat(orderData.price || 0) : 0,
        declaredValue: parseFloat(orderData.itemsValue || orderData.price || 0),

        serviceType: orderData.expressType === 'EZ' ? 'STANDARD' : 'EXPRESS',

        allowOpenPackage: true,
        fragile: false
    };
};

export default {
    authenticateAccurate,
    calculateShipmentFees,
    saveShipment,
    getShipment,
    listShipments,
    getCountries,
    getZones,
    cancelShipment,
    generateAccurateShipmentData
};
