const CLIENT_ID = FHIR_CLIENT_ID;
const APP_SECRET = FHIR_CLIENT_SECRET;
const { BASE, RESOURCE } = fhir;

const instance = axios.create({
  baseURL: RESOURCE,
});

const getAccessToken = async () => {
  const response = await axios({
    url: `${BASE}/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/oauth2/token`,
    method: 'post',
    data: `grant_type=Client_Credentials&resource=${RESOURCE}`,
    auth: {
      username: CLIENT_ID,
      password: APP_SECRET,
    },
  });

  return response.data.access_token;
};

const createPatient = async (patientBody) => {
  const {
    firstName,
    middleIniital,
    lastName,
    birthDate,
    gender,
    reference,
    address,
    city,
    state,
    zipcode,
    email,
    phone,
    ssn,
    mrn,
  } = patientBody;
  const newFhirPatient = {
    resourceType: 'Patient',
    name: [
      { text: 'First Name', given: [firstName] },
      { text: 'Middle Name', given: [middleIniital] },
      { text: 'Last Name', given: [lastName] },
    ],
    birthDate,
    gender,
    managingOrganization: { type: 'Organization', reference },
    address: [{ text: address, city, state, postalCode: zipcode }],
    contact: [
      {
        telecom: [
          { system: 'email', value: email },
          { system: 'phone', value: phone },
        ],
        relationship: {
          coding: [
            { display: 'SSN', code: ssn },
            { display: 'MRN', code: mrn },
          ],
        },
      },
    ],
  };
  const accessToken = await getAccessToken();
  try {
    const response = await instance.post('/Patient', newFhirPatient, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};


const getPatient = async () => {
  const accessToken = await getAccessToken();
  try {
    const response = await instance.get('/Patient', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = [];
    for (let i = 0; i < response.data.entry.length; i++) {
      const entry = response.data.entry[i];

    var id = (entry.resource.id !== undefined) ? entry.resource.id : "";
    var firstName = (entry.resource.name?.[0]?.given?.[0] !== undefined) ? entry.resource.name?.[0]?.given?.[0] : "";
    var middleName = (entry.resource.name?.[1]?.given?.[0] !== undefined) ? entry.resource.name?.[1]?.given?.[0] : "";
    var lastName = (entry.resource.name?.[2]?.given?.[0] !== undefined) ? entry.resource.name?.[2]?.given?.[0] : "";
    var birthDate = (entry.resource.birthDate !== undefined) ? entry.resource.birthDate : "";
    var gender = (entry.resource.gender !== undefined) ? entry.resource.gender : "";
    var address = (entry.resource.address?.[0]?.text !== undefined) ? entry.resource.address?.[0]?.text : "";
    var city = (entry.resource.address?.[0]?.city !== undefined) ? entry.resource.address?.[0]?.city : "";
    var state = (entry.resource.address?.[0]?.state !== undefined) ? entry.resource.address?.[0]?.state : "";
    var zipcode = (entry.resource.address?.[0]?.zipcode !== undefined) ? entry.resource.address?.[0]?.zipcode : "";
    var ssn = (entry.resource.contact?.[0]?.relationship?.[0]?.coding?.[0].code !== undefined) ? entry.resource.contact?.[0]?.relationship?.[0]?.coding?.[0].code : "";
    var mrn = (entry.resource.contact?.[0]?.relationship?.[0]?.coding?.[1].code !== undefined) ? entry.resource.contact?.[0]?.relationship?.[0]?.coding?.[1].code : "";
    var email = (entry.resource.contact?.[0]?.telecom?.[0]?.value !== undefined) ? entry.resource.contact?.[0]?.telecom?.[0]?.value : "";
    var phone = (entry.resource.contact?.[0]?.telecom?.[1]?.value !== undefined) ? entry.resource.contact?.[0]?.telecom?.[1]?.value : "";
    var organizationId = (entry.resource.managingOrganization?.reference !== undefined) ? entry.resource.managingOrganization?.reference : "";

      data.push({
        id,
        firstName,
        middleName,
        lastName,
        birthDate,
        gender,
        address,
        city,
        state,
        zipcode,
        email,
        phone,
        ssn,
        mrn,
        organizationId,
      });
    }
    return data;
  } catch (error) {
    throw error;
  }
};



