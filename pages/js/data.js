/* موعدي - Enterprise Tunisian Medical Data & EHR Registry */

window.موعديData = {
  trustBadges: [
    { text: 'Conforme INPDP (Loi N° 2004-63)', icon: 'shield-check' },
    { text: 'Inscrit à l\'Ordre des Médecins de Tunisie', icon: 'award' },
    { text: 'Interconnexion CNAM & Pharmacie Centrale', icon: 'activity' },
    { text: 'Chiffrement Médical de Bout en Bout', icon: 'lock' }
  ],

  insurancePartners: ['CNAM (Caisse Nationale)', 'STAR Assurances', 'GAT Assurances', 'COMAR Assurances', 'MAGHREBIA', 'ASTREE'],

  pharmaciesDeGarde: [
    { id: 'ph-1', name: 'Pharmacie de Garde Nuit Ennasr', pharmacist: 'Dr. Leila Ben Slimane', type: 'GARDE_NUIT', city: 'Tunis', delegation: 'Ennasr 2', address: 'Avenue Hédi Nouira, Ennasr 2 (En face de la Mosquée)', phone: '+216 71 832 000', openHours: '20:00 - 08:00 (Nuit 7j/7)', status: 'OUVERT_NUIT' },
    { id: 'ph-2', name: 'Pharmacie de Garde Jour Lac 2', pharmacist: 'Dr. Yassine Trabelsi', type: 'GARDE_JOUR', city: 'Tunis', delegation: 'Les Berges du Lac 2', address: 'Rue de la Feuille d\'Érable, Lac 2', phone: '+216 71 267 111', openHours: '08:00 - 20:00 (Dimanche & Jours Fériés)', status: 'OUVERT_JOUR' },
    { id: 'ph-3', name: 'Pharmacie de Garde Nuit Khzama', pharmacist: 'Dr. Hela Bouaziz', type: 'GARDE_NUIT', city: 'Sousse', delegation: 'Khzama Est', address: 'Boulevard 14 Janvier, Khzama, Sousse', phone: '+216 73 324 500', openHours: '20:00 - 08:00 (Nuit 7j/7)', status: 'OUVERT_NUIT' },
    { id: 'ph-4', name: 'Pharmacie de Garde Sfax Médina', pharmacist: 'Dr. Mohamed Karray', type: 'GARDE_NUIT', city: 'Sfax', delegation: 'Sfax Médina', address: 'Route de Teniour Km 1.5, Sfax', phone: '+216 74 401 220', openHours: '20:00 - 08:00 (Nuit 7j/7)', status: 'OUVERT_NUIT' }
  ],

  specialties: [
    { id: 'cardio', fr: 'Cardiologie & Maladies Vasculaires', ar: 'أخصائي أمراض القلب والأوعية الدموية' },
    { id: 'pediatrie', fr: 'Pédiatrie & Néonatologie', ar: 'أخصائية طب الأطفال وحديثي الولادة' },
    { id: 'dentiste', fr: 'Chirurgie Dentaire & Implantologie', ar: 'جراحة وتجميل الأسنان' },
    { id: 'generaliste', fr: 'Médecine Générale & Urgences', ar: 'طب عام واستشارات عاجلة' },
    { id: 'gyneco', fr: 'Gynécologie Obstétrique & PMA', ar: 'أخصائية أمراض النساء والتوليد' },
    { id: 'ophtalmo', fr: 'Ophtalmologie & Chirurgie Réfractive', ar: 'أخصائي أمراض وجراحة العيون' },
    { id: 'dermato', fr: 'Dermatologie & Vénérologie', ar: 'أخصائي الأمراض الجلدية والتناسلية' }
  ],

  locations: [
    { city: 'Ariana', delegations: ['Ariana Ville', 'Ghazela', 'Riadh El Andalous', 'Mnihla', 'Soukra'] },
    { city: 'Béja', delegations: ['Béja Nord', 'Béja Sud', 'Medjez el-Bab', 'Testour'] },
    { city: 'Ben Arous', delegations: ['Ben Arous', 'Ezzahra', 'Rades', 'Hammam Lif', 'Megrine'] },
    { city: 'Bizerte', delegations: ['Bizerte Nord', 'Menzel Bourguiba', 'Ras Jebel', 'Ghar El Melh'] },
    { city: 'Gabès', delegations: ['Gabès Ville', 'Gabès Sud', 'El Hamma', 'Mareth'] },
    { city: 'Gafsa', delegations: ['Gafsa Ville', 'El Ksar', 'Metlaoui', 'Redeyef'] },
    { city: 'Jendouba', delegations: ['Jendouba Ville', 'Tabarka', 'Ain Draham', 'Bou Salem'] },
    { city: 'Kairouan', delegations: ['Kairouan Nord', 'Kairouan Sud', 'Sbikha', 'Haffouz'] },
    { city: 'Kasserine', delegations: ['Kasserine Nord', 'Sbeitla', 'Feriana', 'Thala'] },
    { city: 'Kébili', delegations: ['Kébili Nord', 'Douz', 'Souk Lahad'] },
    { city: 'Le Kef', delegations: ['Le Kef Est', 'Dahmani', 'Tajerouine', 'Sers'] },
    { city: 'Mahdia', delegations: ['Mahdia Ville', 'Ksour Essef', 'Chebba', 'El Jem'] },
    { city: 'La Manouba', delegations: ['Manouba Ville', 'Denden', 'Oued Ellil', 'Tebourba'] },
    { city: 'Médenine', delegations: ['Médenine Ville', 'Djerba Houmt Souk', 'Djerba Midoun', 'Zarzis'] },
    { city: 'Monastir', delegations: ['Monastir Ville', 'Skanès', 'Moknine', 'Ksar Hellal', 'Jemmal'] },
    { city: 'Nabeul', delegations: ['Nabeul Ville', 'Hammamet', 'Kelibia', 'Korba', 'Soliman'] },
    { city: 'Sfax', delegations: ['Sfax Ville', 'Route de Teniour', 'Sfax Médina', 'Route de Tunis', 'Sakiet Ezzit'] },
    { city: 'Sidi Bouzid', delegations: ['Sidi Bouzid Est', 'Regueb', 'Jilma', 'Meknassy'] },
    { city: 'Siliana', delegations: ['Siliana Ville', 'Makthar', 'Gaâfour', 'Bou Arada'] },
    { city: 'Sousse', delegations: ['Sousse Ville', 'Khzama Est', 'Kantaoui', 'Sahloul', 'Msaken'] },
    { city: 'Tataouine', delegations: ['Tataouine Nord', 'Ghomrassen', 'Remada'] },
    { city: 'Tozeur', delegations: ['Tozeur Ville', 'Nefta', 'Degache'] },
    { city: 'Tunis', delegations: ['Ennasr 2', 'Les Berges du Lac 2', 'El Menzah 6', 'Centre Ville', 'L\'Aouina', 'Mutuelleville'] },
    { city: 'Zaghouan', delegations: ['Zaghouan Ville', 'El Fahs', 'Nadhour'] }
  ],

  pctMedications: [
    { id: 'pct-1', name: 'Doliprane 1000 mg', form: 'Comprimé effervescent', category: 'Antalgique / Paracétamol', defaultPosology: '1 comprimé toutes les 8 heures si douleur', pctCode: 'PCT-321094' },
    { id: 'pct-2', name: 'Augmentin 1 g / 125 mg', form: 'Comprimé pelliculé', category: 'Antibiotique (Amoxicilline / Ac. Clavulanique)', defaultPosology: '1 comprimé 2 fois par jour pendant 7 jours', pctCode: 'PCT-104882' },
    { id: 'pct-3', name: 'Inexium 40 mg', form: 'Comprimé gastro-résistant', category: 'Anti-ulcéreux / IPP', defaultPosology: '1 comprimé le matin à jeun pendant 14 jours', pctCode: 'PCT-502911' },
    { id: 'pct-4', name: 'Spasfon 80 mg', form: 'Lyoc / Comprimé', category: 'Antispasmodique', defaultPosology: '2 comprimés en cas de crise (max 6/jour)', pctCode: 'PCT-209144' },
    { id: 'pct-5', name: 'Solupred 20 mg', form: 'Comprimé orodispersible', category: 'Corticostéroïde (Prednisolone)', defaultPosology: '2 comprimés le matin avec le petit-déjeuner pendant 5 jours', pctCode: 'PCT-883012' },
    { id: 'pct-6', name: 'Tahor 20 mg', form: 'Comprimé pelliculé', category: 'Hypolipémiant / Atorvastatine', defaultPosology: '1 comprimé le soir au coucher', pctCode: 'PCT-901244' }
  ],

  doctors: [
    { id: "doc-1", name: "Dr. Selim Ben Ali", title: "Ancien Interne des Hôpitaux de Tunis", ordreId: "N° 14092", specialtyId: "cardio", specialtyFr: "Cardiologie & Maladies Vasculaires", specialtyAr: "أخصائي أمراض القلب والأوعية الدموية", city: "Tunis", delegation: "Ennasr 2", address: "Avenue Hédi Nouira, Résidence Les Palmiers, Bloc B, Ennasr 2, 2037 Tunis", phone: "+216 71 830 120", fee: 70, cnamReimbursement: 49, cnam: true, cnamType: "Filière Privée", cnamCode: "CNAM-CD-40912", faculty: "Faculté de Médecine de Tunis", equipment: ["Échocardiographie 4D", "Holter MAPA 24h"], insuranceAccepted: ["CNAM", "STAR"], telehealth: true, rating: 4.92, reviewsCount: 142, avatar: "images/3ila_doctor.jpeg" },
    { id: "doc-2", name: "Dr. Meriem Karray", title: "Maître d'Enseignement en Pédiatrie", ordreId: "N° 18210", specialtyId: "pediatrie", specialtyFr: "Pédiatrie & Néonatologie", specialtyAr: "أخصائية طب الأطفال وحديثي الولادة", city: "Tunis", delegation: "Les Berges du Lac 2", address: "Immeuble Le Grand Bleu, Lac 2, 1053 Tunis", phone: "+216 71 268 400", fee: 65, cnamReimbursement: 45, cnam: true, cnamType: "Conventionné CNAM", cnamCode: "CNAM-PED-88102", faculty: "Faculté de Médecine de Sousse", equipment: ["Cabinet pédiatrique sécurisé"], insuranceAccepted: ["CNAM", "ASTREE"], telehealth: true, rating: 4.96, reviewsCount: 228, avatar: "images/3ila_doctor.jpeg" },
    { id: "doc-3", name: "Dr. Youssef Trabelsi", title: "Spécialiste en Implantologie Dentaire", ordreId: "N° 21044", specialtyId: "dentiste", specialtyFr: "Chirurgie Dentaire & Implantologie", specialtyAr: "جراحة الأسنان وزراعة الأسنان", city: "Ariana", delegation: "Riadh El Andalous", address: "Résidence Les Jasmins, Riadh El Andalous, Ariana", phone: "+216 71 700 890", fee: 60, cnamReimbursement: 40, cnam: true, cnamType: "Conventionné CNAM", cnamCode: "CNAM-DENT-1044", faculty: "Faculté de Médecine Dentaire de Monastir", equipment: ["Radio Panoramique 3D"], insuranceAccepted: ["CNAM", "STAR"], telehealth: false, rating: 4.88, reviewsCount: 98, avatar: "images/3ila_doctor.jpeg" },
    { id: "doc-4", name: "Dr. Amina Sfar", title: "Médecin Généraliste & Urgentiste", ordreId: "N° 19550", specialtyId: "generaliste", specialtyFr: "Médecine Générale & Urgences", specialtyAr: "الطب العام والحالات المستعجلة", city: "Sousse", delegation: "Sahloul", address: "Boulevard Yasser Arafat, Sahloul, Sousse", phone: "+216 73 369 110", fee: 50, cnamReimbursement: 35, cnam: true, cnamType: "Conventionné CNAM", cnamCode: "CNAM-GEN-9550", faculty: "Faculté de Médecine de Sousse", equipment: ["ECG portable"], insuranceAccepted: ["CNAM", "COMAR"], telehealth: true, rating: 4.90, reviewsCount: 175, avatar: "images/3ila_doctor.jpeg" },
    { id: "doc-5", name: "Dr. Mohamed Triki", title: "Chef de Clinique en Cardiologie", ordreId: "N° 16780", specialtyId: "cardio", specialtyFr: "Cardiologie & Maladies Vasculaires", specialtyAr: "أخصائي أمراض القلب", city: "Sfax", delegation: "Route de Teniour", address: "Route de Teniour KM 1.5, 3000 Sfax", phone: "+216 74 400 220", fee: 75, cnamReimbursement: 50, cnam: true, cnamType: "Filière Privée", cnamCode: "CNAM-CD-6780", faculty: "Faculté de Médecine de Sfax", equipment: ["Échographie cardiaque 4D"], insuranceAccepted: ["CNAM", "STAR"], telehealth: true, rating: 4.95, reviewsCount: 210, avatar: "images/3ila_doctor.jpeg" },
    { id: "doc-6", name: "Dr. Chiraz Chaouch", title: "Spécialiste en Gynécologie", ordreId: "N° 22100", specialtyId: "gyneco", specialtyFr: "Gynécologie Obstétrique & PMA", specialtyAr: "أخصائية أمراض النساء والتوليد", city: "Monastir", delegation: "Skanès", address: "Route Touristique Skanès, 5000 Monastir", phone: "+216 73 500 111", fee: 70, cnamReimbursement: 49, cnam: true, cnamType: "Conventionné CNAM", cnamCode: "CNAM-GYN-2100", faculty: "Faculté de Médecine de Monastir", equipment: ["Échographe 3D/4D"], insuranceAccepted: ["CNAM", "MAGHREBIA"], telehealth: true, rating: 4.94, reviewsCount: 185, avatar: "images/3ila_doctor.jpeg" },
    { id: "doc-7", name: "Dr. Bilel Gharbi", title: "Chirurgien Dentiste", ordreId: "N° 24050", specialtyId: "dentiste", specialtyFr: "Chirurgie Dentaire & Orthodontie", specialtyAr: "جراحة الأسنان وتقويم الأسنان", city: "Nabeul", delegation: "Hammamet", address: "Avenue Habib Bourguiba, Hammamet, 8050 Nabeul", phone: "+216 72 280 900", fee: 60, cnamReimbursement: 40, cnam: true, cnamType: "Conventionné CNAM", cnamCode: "CNAM-DENT-4050", faculty: "Faculté de Médecine Dentaire de Monastir", equipment: ["Scanner 3D Cone Beam"], insuranceAccepted: ["CNAM", "COMAR"], telehealth: false, rating: 4.89, reviewsCount: 112, avatar: "images/3ila_doctor.jpeg" },
    { id: "doc-8", name: "Dr. Hela Bouzid", title: "Spécialiste en Pédiatrie", ordreId: "N° 17890", specialtyId: "pediatrie", specialtyFr: "Pédiatrie & Neonatologie", specialtyAr: "أخصائية طب الأطفال", city: "Ben Arous", delegation: "Rades", address: "Avenue la République, Radès, Ben Arous", phone: "+216 71 440 300", fee: 60, cnamReimbursement: 42, cnam: true, cnamType: "Conventionné CNAM", cnamCode: "CNAM-PED-7890", faculty: "Faculté de Médecine de Tunis", equipment: ["Aérosolthérapie"], insuranceAccepted: ["CNAM", "STAR"], telehealth: true, rating: 4.91, reviewsCount: 130, avatar: "images/3ila_doctor.jpeg" },
    { id: "doc-9", name: "Dr. Tarek Rezgui", title: "Médecin Généraliste", ordreId: "N° 15670", specialtyId: "generaliste", specialtyFr: "Médecine Générale", specialtyAr: "الطب العام", city: "Bizerte", delegation: "Bizerte Nord", address: "Boulevard Hassan Nouri, 7000 Bizerte", phone: "+216 72 430 150", fee: 45, cnamReimbursement: 32, cnam: true, cnamType: "Conventionné CNAM", cnamCode: "CNAM-GEN-5670", faculty: "Faculté de Médecine de Tunis", equipment: ["ECG"], insuranceAccepted: ["CNAM"], telehealth: true, rating: 4.87, reviewsCount: 94, avatar: "images/3ila_doctor.jpeg" },
    { id: "doc-10", name: "Dr. Souad Elloumi", title: "Gynécologue Obstétricienne", ordreId: "N° 20110", specialtyId: "gyneco", specialtyFr: "Gynécologie Obstétrique", specialtyAr: "أخصائية أمراض النساء والتوليد", city: "Gabès", delegation: "Gabès Ville", address: "Avenue Farhat Hached, 6000 Gabès", phone: "+216 75 270 800", fee: 65, cnamReimbursement: 45, cnam: true, cnamType: "Conventionné CNAM", cnamCode: "CNAM-GYN-0110", faculty: "Faculté de Médecine de Sfax", equipment: ["Échographie obstétricale"], insuranceAccepted: ["CNAM"], telehealth: true, rating: 4.93, reviewsCount: 150, avatar: "images/3ila_doctor.jpeg" },
    { id: "doc-11", name: "Dr. Lotfi Ammar", title: "Cardiologue", ordreId: "N° 13450", specialtyId: "cardio", specialtyFr: "Cardiologie & Maladies Vasculaires", specialtyAr: "أخصائي أمراض القلب", city: "Gafsa", delegation: "Gafsa Ville", address: "Rue Ali Belhouane, 2100 Gafsa", phone: "+216 76 220 400", fee: 65, cnamReimbursement: 45, cnam: true, cnamType: "Conventionné CNAM", cnamCode: "CNAM-CD-3450", faculty: "Faculté de Médecine de Sousse", equipment: ["Échocardiographe"], insuranceAccepted: ["CNAM"], telehealth: false, rating: 4.89, reviewsCount: 88, avatar: "images/3ila_doctor.jpeg" },
    { id: "doc-12", name: "Dr. Asma Zouari", title: "Pédiatre", ordreId: "N° 19020", specialtyId: "pediatrie", specialtyFr: "Pédiatrie & Santé Infantile", specialtyAr: "أخصائية طب الأطفال", city: "Kairouan", delegation: "Kairouan Nord", address: "Avenue Ibn El Jazzar, 3100 Kairouan", phone: "+216 77 230 900", fee: 55, cnamReimbursement: 38, cnam: true, cnamType: "Conventionné CNAM", cnamCode: "CNAM-PED-9020", faculty: "Faculté de Médecine de Sousse", equipment: ["Surveillance croissance"], insuranceAccepted: ["CNAM"], telehealth: true, rating: 4.91, reviewsCount: 105, avatar: "images/3ila_doctor.jpeg" },
    { id: "doc-13", name: "Dr. Sami Hamza", title: "Dentiste", ordreId: "N° 23900", specialtyId: "dentiste", specialtyFr: "Chirurgie Dentaire", specialtyAr: "جراحة الأسنان", city: "Mahdia", delegation: "Mahdia Ville", address: "Boulevard 7 Novembre, 5100 Mahdia", phone: "+216 73 680 120", fee: 55, cnamReimbursement: 38, cnam: true, cnamType: "Conventionné CNAM", cnamCode: "CNAM-DENT-3900", faculty: "Faculté de Médecine Dentaire de Monastir", equipment: ["Radio intra-orale"], insuranceAccepted: ["CNAM"], telehealth: false, rating: 4.86, reviewsCount: 76, avatar: "images/3ila_doctor.jpeg" },
    { id: "doc-14", name: "Dr. Nader Mansouri", title: "Médecin Généraliste", ordreId: "N° 16230", specialtyId: "generaliste", specialtyFr: "Médecine Générale", specialtyAr: "الطب العام", city: "Kasserine", delegation: "Sbeitla", address: "Avenue Habib Bourguiba, Sbeitla, 1250 Kasserine", phone: "+216 77 470 500", fee: 40, cnamReimbursement: 30, cnam: true, cnamType: "Conventionné CNAM", cnamCode: "CNAM-GEN-6230", faculty: "Faculté de Médecine de Sousse", equipment: ["Soins d'urgence"], insuranceAccepted: ["CNAM"], telehealth: true, rating: 4.85, reviewsCount: 62, avatar: "images/3ila_doctor.jpeg" },
    { id: "doc-15", name: "Dr. Ines Cherif", title: "Gynécologue", ordreId: "N° 21800", specialtyId: "gyneco", specialtyFr: "Gynécologie Obstétrique", specialtyAr: "أخصائية أمراض النساء والتوليد", city: "Béja", delegation: "Béja Nord", address: "Rue de la République, 9000 Béja", phone: "+216 78 450 600", fee: 60, cnamReimbursement: 42, cnam: true, cnamType: "Conventionné CNAM", cnamCode: "CNAM-GYN-1800", faculty: "Faculté de Médecine de Tunis", equipment: ["Échographie gynécologique"], insuranceAccepted: ["CNAM"], telehealth: true, rating: 4.90, reviewsCount: 82, avatar: "images/3ila_doctor.jpeg" },
    { id: "doc-16", name: "Dr. Walid Dridi", title: "Médecin Généraliste", ordreId: "N° 17400", specialtyId: "generaliste", specialtyFr: "Médecine Générale", specialtyAr: "الطب العام", city: "Jendouba", delegation: "Tabarka", address: "Avenue Habib Bourguiba, Tabarka, 8110 Jendouba", phone: "+216 78 670 100", fee: 45, cnamReimbursement: 32, cnam: true, cnamType: "Conventionné CNAM", cnamCode: "CNAM-GEN-7400", faculty: "Faculté de Médecine de Tunis", equipment: ["ECG"], insuranceAccepted: ["CNAM"], telehealth: true, rating: 4.88, reviewsCount: 70, avatar: "images/3ila_doctor.jpeg" },
    { id: "doc-17", name: "Dr. Olfa Bedoui", title: "Cardiologue", ordreId: "N° 18950", specialtyId: "cardio", specialtyFr: "Cardiologie & Maladies Vasculaires", specialtyAr: "أخصائية أمراض القلب", city: "Le Kef", delegation: "Le Kef Est", address: "Avenue Mongi Slim, 7100 Le Kef", phone: "+216 78 200 330", fee: 60, cnamReimbursement: 42, cnam: true, cnamType: "Conventionné CNAM", cnamCode: "CNAM-CD-8950", faculty: "Faculté de Médecine de Tunis", equipment: ["Échographie Doppler"], insuranceAccepted: ["CNAM"], telehealth: false, rating: 4.89, reviewsCount: 75, avatar: "images/3ila_doctor.jpeg" },
    { id: "doc-18", name: "Dr. Ramzi Said", title: "Dentiste", ordreId: "N° 22900", specialtyId: "dentiste", specialtyFr: "Chirurgie Dentaire", specialtyAr: "جراحة الأسنان", city: "La Manouba", delegation: "Denden", address: "Avenue de l'Indépendance, Denden, La Manouba", phone: "+216 71 600 450", fee: 55, cnamReimbursement: 38, cnam: true, cnamType: "Conventionné CNAM", cnamCode: "CNAM-DENT-2900", faculty: "Faculté de Médecine Dentaire de Monastir", equipment: ["Radio numérique"], insuranceAccepted: ["CNAM"], telehealth: false, rating: 4.87, reviewsCount: 89, avatar: "images/3ila_doctor.jpeg" },
    { id: "doc-19", name: "Dr. Rim Slama", title: "Pédiatre", ordreId: "N° 20450", specialtyId: "pediatrie", specialtyFr: "Pédiatrie & Santé Infantile", specialtyAr: "أخصائية طب الأطفال", city: "Médenine", delegation: "Djerba Midoun", address: "Zone Touristique, Midoun, Djerba, 4116 Médenine", phone: "+216 75 730 200", fee: 65, cnamReimbursement: 45, cnam: true, cnamType: "Conventionné CNAM", cnamCode: "CNAM-PED-0450", faculty: "Faculté de Médecine de Sfax", equipment: ["Nébuleur pédiatrique"], insuranceAccepted: ["CNAM"], telehealth: true, rating: 4.94, reviewsCount: 140, avatar: "images/3ila_doctor.jpeg" },
    { id: "doc-20", name: "Dr. Hamdi Brahmi", title: "Médecin Généraliste", ordreId: "N° 18120", specialtyId: "generaliste", specialtyFr: "Médecine Générale", specialtyAr: "الطب العام", city: "Sidi Bouzid", delegation: "Sidi Bouzid Est", address: "Avenue la République, 9100 Sidi Bouzid", phone: "+216 76 630 110", fee: 40, cnamReimbursement: 28, cnam: true, cnamType: "Conventionné CNAM", cnamCode: "CNAM-GEN-8120", faculty: "Faculté de Médecine de Sousse", equipment: ["Tensiomètre"], insuranceAccepted: ["CNAM"], telehealth: true, rating: 4.84, reviewsCount: 55, avatar: "images/3ila_doctor.jpeg" },
    { id: "doc-21", name: "Dr. Dorra Jlassi", title: "Gynécologue", ordreId: "N° 21340", specialtyId: "gyneco", specialtyFr: "Gynécologie Obstétrique", specialtyAr: "أخصائية أمراض النساء والتوليد", city: "Siliana", delegation: "Siliana Ville", address: "Rue Habib Bourguiba, 6100 Siliana", phone: "+216 78 870 300", fee: 55, cnamReimbursement: 38, cnam: true, cnamType: "Conventionné CNAM", cnamCode: "CNAM-GYN-1340", faculty: "Faculté de Médecine de Tunis", equipment: ["Échographe 2D"], insuranceAccepted: ["CNAM"], telehealth: true, rating: 4.88, reviewsCount: 64, avatar: "images/3ila_doctor.jpeg" },
    { id: "doc-22", name: "Dr. Karim Houas", title: "Cardiologue", ordreId: "N° 17650", specialtyId: "cardio", specialtyFr: "Cardiologie & Maladies Vasculaires", specialtyAr: "أخصائي أمراض القلب", city: "Tataouine", delegation: "Tataouine Nord", address: "Avenue 7 Novembre, 3200 Tataouine", phone: "+216 75 860 400", fee: 60, cnamReimbursement: 42, cnam: true, cnamType: "Conventionné CNAM", cnamCode: "CNAM-CD-7650", faculty: "Faculté de Médecine de Sfax", equipment: ["ECG"], insuranceAccepted: ["CNAM"], telehealth: false, rating: 4.86, reviewsCount: 58, avatar: "images/3ila_doctor.jpeg" },
    { id: "doc-23", name: "Dr. Fatma Belgacem", title: "Médecin Généraliste", ordreId: "N° 19800", specialtyId: "generaliste", specialtyFr: "Médecine Générale", specialtyAr: "الطب العام", city: "Tozeur", delegation: "Tozeur Ville", address: "Avenue Farhat Hached, 2200 Tozeur", phone: "+216 76 450 120", fee: 45, cnamReimbursement: 32, cnam: true, cnamType: "Conventionné CNAM", cnamCode: "CNAM-GEN-9800", faculty: "Faculté de Médecine de Sousse", equipment: ["Consultation générale"], insuranceAccepted: ["CNAM"], telehealth: true, rating: 4.89, reviewsCount: 71, avatar: "images/3ila_doctor.jpeg" },
    { id: "doc-24", name: "Dr. Maher Ben Salem", title: "Dentiste", ordreId: "N° 23100", specialtyId: "dentiste", specialtyFr: "Chirurgie Dentaire", specialtyAr: "جراحة الأسنان", city: "Zaghouan", delegation: "Zaghouan Ville", address: "Avenue de l'Indépendance, 1100 Zaghouan", phone: "+216 72 675 200", fee: 50, cnamReimbursement: 35, cnam: true, cnamType: "Conventionné CNAM", cnamCode: "CNAM-DENT-3100", faculty: "Faculté de Médecine Dentaire de Monastir", equipment: ["Radio dentaire"], insuranceAccepted: ["CNAM"], telehealth: false, rating: 4.87, reviewsCount: 68, avatar: "images/3ila_doctor.jpeg" },
    { id: "doc-25", name: "Dr. Anis Mabrouk", title: "Pédiatre", ordreId: "N° 20890", specialtyId: "pediatrie", specialtyFr: "Pédiatrie & Santé Infantile", specialtyAr: "أخصائي طب الأطفال", city: "Kébili", delegation: "Douz", address: "Avenue des Martyrs, Douz, 4260 Kébili", phone: "+216 75 470 300", fee: 55, cnamReimbursement: 38, cnam: true, cnamType: "Conventionné CNAM", cnamCode: "CNAM-PED-0890", faculty: "Faculté de Médecine de Sfax", equipment: ["Pèse-bébé"], insuranceAccepted: ["CNAM"], telehealth: true, rating: 4.90, reviewsCount: 78, avatar: "images/3ila_doctor.jpeg" }
  ],

  patientEHRs: {
    'Sami Mansour': {
      age: 52,
      gender: 'Homme',
      blood: 'A+',
      cnamNo: 'CNAM-44910-A',
      allergies: ['Pénicilline', 'Pollen'],
      antecedents: ['Hypertension Artérielle (HTA)', 'Hypercholestérolémie'],
      labReports: [
        { date: '01/08/2026', title: 'Bilan Lipidique & Glycémie à Jeun', lab: 'Laboratoire Pasteur Tunis', pdfUrl: '#', status: 'VALIDE' },
        { date: '15/05/2026', title: 'Holter Tensionnel MAPA 24h', lab: 'Cabinet Dr. Ben Ali', pdfUrl: '#', status: 'VALIDE' }
      ],
      consultationHistory: [
        { date: '12/05/2026', motif: 'Bilan Annuel Cardiaque', doc: 'Dr. Selim Ben Ali', notes: 'Tension 13/8, EKG normal.' },
        { date: '10/01/2026', motif: 'Renouvellement HTA', doc: 'Dr. Selim Ben Ali', notes: 'Poursuite Tahor 20mg.' }
      ]
    }
  },

  initialQueue: [
    { id: 'q-1', rank: 1, name: 'Sami Mansour', phone: '+216 98 124 556', motif: 'Consultation Suivi Cardiaque', status: 'En Consultation', time: '09:30', payment: 'Espèces (70 TND)', cnamSheet: 'BS-8891' },
    { id: 'q-2', rank: 2, name: 'Amel Gharbi', phone: '+216 55 890 112', motif: 'Électrocardiogramme & Lecture d\'Analyses', status: 'En salle d\'attente', time: '10:00', payment: 'CNAM (Prise en charge + 21 TND)', cnamSheet: 'BS-8892' },
    { id: 'q-3', rank: 3, name: 'Mohamed Salah Jouini', phone: '+216 22 456 789', motif: 'Nouveau Patient (Douleur Thoracique)', status: 'En salle d\'attente', time: '10:30', payment: 'Chèque (70 TND)', cnamSheet: 'BS-8893' },
    { id: 'q-4', rank: 4, name: 'Fatma Ben Abdallah', phone: '+216 20 999 123', motif: 'Contrôle Tensionnel MAPA', status: 'En salle d\'attente', time: '11:00', payment: 'Flouci Mobile Pay (70 TND)', cnamSheet: 'BS-8894' }
  ]
};

// Merge Custom Registered Doctors from localStorage
try {
  const customDocs = JSON.parse(localStorage.getItem('موعدي_custom_doctors') || '[]');
  if (customDocs && customDocs.length > 0) {
    window.موعديData.doctors = [...customDocs, ...window.موعديData.doctors];
  }
} catch(e) {}

