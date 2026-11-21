import { presidentContent } from './president'

export const advisoryCommitteeMembers = [
  'Prof. P. C. Sood (Padma Shri awardee, 2023) – Banaras Hindu University, Varanasi',
  'Prof. S. C. Pancholi – University of Delhi, Delhi',
  'Prof. R. Prasad – Aligarh Muslim University, Aligarh',
  'Prof. R. K. Bhandari – Variable Energy Cyclotron Centre, Kolkata',
  'Prof. V. N. Bhoraskar – Savitribai Phule Pune University, Pune',
  'Prof. S. Kailas – Bhabha Atomic Research Centre, Mumbai',
  'Prof. Amit Roy – Inter-University Accelerator Centre, New Delhi',
  'Prof. S. K. Singh – Aligarh Muslim University, Aligarh',
  'Prof. R. K. Choudhury – Bhabha Atomic Research Centre, Mumbai',
  'Prof. D. K. Srivastava – Variable Energy Cyclotron Centre, Kolkata',
  'Dr. Dinakar Kanjilal – Inter-University Accelerator Centre, New Delhi',
  'Prof. Avinash C. Pandey – Inter-University Accelerator Centre, New Delhi',
  'Prof. A. K. Sinha – UGC–DAE Consortium for Scientific Research',
  'Dr. D. K. Mohapatra – Atomic Energy Regulatory Board, Mumbai',
  'Prof. N. M. Badiger – Karnatak University, Dharwad, Karnataka',
  'Prof. V. K. B. Kota – Physical Research Laboratory, Ahmedabad',
  'Prof. Bijay K. Agrawal – Saha Institute of Nuclear Physics, Kolkata',
  'Prof. Radhey Shyam – Saha Institute of Nuclear Physics, Kolkata',
  'Dr. R. P. Singh – Inter-University Accelerator Centre, New Delhi',
  'Dr. S. Muralithar – Inter-University Accelerator Centre, New Delhi',
] as const

export const executiveCouncilSections = [
  {
    heading: 'President',
    items: [`${presidentContent.name} – ${presidentContent.affiliation}`],
  },
  {
    heading: 'Vice Presidents',
    items: [
      'Prof. Samit Mandal – University of Delhi, Delhi',
      'Prof. R. Palit – Tata Institute of Fundamental Research, Mumbai, Maharashtra',
    ],
  },
  {
    heading: 'Executive Secretary',
    items: ['Prof. Manoj Kumar Sharma – University of Lucknow, Lucknow'],
  },
  {
    heading: 'Joint Secretaries',
    items: [
      'Prof. Manoj Kumar Sharma (Joint Secretary I) – TIET, Patiala, Punjab',
      'Prof. Bivas R. Behera (Joint Secretary II) – Panjab University, Chandigarh, Punjab',
    ],
  },
  {
    heading: 'Treasurer',
    items: ['Prof. Ajay Kumar Tyagi – Banaras Hindu University, Varanasi, U.P.'],
  },
  {
    heading: 'Members',
    items: [
      'Prof. N. L. Singh – M. S. University of Baroda, Vadodara',
      'Prof. Tarkeshwar Trivedi – University of Allahabad, Prayagraj',
      'Dr. Mohd. Shuaib – Aligarh Muslim University, Aligarh',
      'Prof. M. Balasubramaniam – Bharathiar University, Coimbatore',
    ],
  },
  {
    heading: 'Council Members',
    items: [
      'Prof. S. Santra – BARC, Mumbai',
      'Prof. K. P. Singh – Panjab University, Chandigarh',
      'Prof. M. M. Musthafa – University of Calicut, Calicut',
      'Dr. Sandeep Ghugre – UGC–DAE Consortium for Scientific Research, Kolkata',
      'Prof. Tilak Ghosh – VECC, Kolkata',
      'Dr. Subir Nath – IUAC, New Delhi',
      'Prof. H. M. Mittal – NIT, Jalandhar',
      'Prof. Harleen Dahiya – NIT, Jalandhar',
      'Prof. J. J. Das – Cotton University, Assam',
      'Prof. Prince Ganai – NIT, Srinagar, Kashmir',
      'Prof. Sunita Gupta – Agra College, Agra',
      'Prof. Avinash Agrawal – Bareilly College, Bareilly',
      'Dr. Rhine Kumar – Cochin University of Science and Technology, Kochi',
      'Dr. Dipika Patel – SVNIT, Surat, Gujarat',
      'Dr. Akashrup Banerjee – SINP, Kolkata',
      'Prof. Indranil Mazumdar – TIFR, Mumbai',
      'Prof. A. M. Vinod Kumar – University of Calicut, Calicut',
      'Prof. Javid Sheikh – Kashmir University, Srinagar, Jammu and Kashmir',
      'Dr. Sunethra Ramanan – Department of Physics, IIT Madras',
      'Prof. Vandana Nanal – TIFR, Mumbai',
    ],
  },
] as const
