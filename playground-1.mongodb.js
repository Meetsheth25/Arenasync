// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The database to use.
use('ArenaSync');

// ==========================================
// 1. Seed Coach Users
// ==========================================
const coaches = [
  {
    "_id": ObjectId("6a0986443e64d4411066cb5e"),
    "name": "Mit Coach",
    "email": "mitsheth2@gmail.com",
    "password": "$2b$10$aII8/9NRrrO8sawgTXFLtuU4mEsHG.tDH8BnCLlvUEYfUcePoHS8i",
    "emailVerified": true,
    "role": "coach",
    "status": "active",
    "isDeleted": false,
    "isPhoneVerified": true,
    "phoneNumber": "+919900000001",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "_id": ObjectId("6a1abf39b7b5ee4301f2feba"),
    "name": "Sanya Coach",
    "email": "sanyashah3104@gmail.com",
    "password": "$2b$10$Iz4UJhKCq8SEjOu/Kh94Ru5cw9AbDIsFtN5lnDlab13EOaq4WYG56",
    "emailVerified": true,
    "role": "coach",
    "status": "active",
    "isDeleted": false,
    "isPhoneVerified": true,
    "phoneNumber": "+919900000002",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "_id": ObjectId("6a1acddad2706f3d0307e469"),
    "name": "Sanya Coach 2",
    "email": "sanyashah318@gmail.com",
    "password": "$2b$10$suN8SPTqeY73LFdcTbfyVea8mtCmULejzlD2MYn1k9bKn0wL24mfG",
    "emailVerified": false,
    "role": "coach",
    "status": "active",
    "isDeleted": false,
    "isPhoneVerified": true,
    "phoneNumber": "+919979183737",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "_id": ObjectId("6a0986443e64d4411066cb61"),
    "name": "Raj Coach",
    "email": "raj.coach@gmail.com",
    "password": "$2b$10$aII8/9NRrrO8sawgTXFLtuU4mEsHG.tDH8BnCLlvUEYfUcePoHS8i",
    "emailVerified": true,
    "role": "coach",
    "status": "active",
    "isDeleted": false,
    "isPhoneVerified": true,
    "phoneNumber": "+919900000004",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "_id": ObjectId("6a0986443e64d4411066cb62"),
    "name": "Priya Coach",
    "email": "priya.coach@gmail.com",
    "password": "$2b$10$aII8/9NRrrO8sawgTXFLtuU4mEsHG.tDH8BnCLlvUEYfUcePoHS8i",
    "emailVerified": true,
    "role": "coach",
    "status": "active",
    "isDeleted": false,
    "isPhoneVerified": true,
    "phoneNumber": "+919900000005",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "_id": ObjectId("6a0986443e64d4411066cb63"),
    "name": "Aarav Coach",
    "email": "aarav.coach@gmail.com",
    "password": "$2b$10$aII8/9NRrrO8sawgTXFLtuU4mEsHG.tDH8BnCLlvUEYfUcePoHS8i",
    "emailVerified": true,
    "role": "coach",
    "status": "active",
    "isDeleted": false,
    "isPhoneVerified": true,
    "phoneNumber": "+919900000006",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "_id": ObjectId("6a0986443e64d4411066cb64"),
    "name": "Rohan Coach",
    "email": "rohan.coach@gmail.com",
    "password": "$2b$10$aII8/9NRrrO8sawgTXFLtuU4mEsHG.tDH8BnCLlvUEYfUcePoHS8i",
    "emailVerified": true,
    "role": "coach",
    "status": "active",
    "isDeleted": false,
    "isPhoneVerified": true,
    "phoneNumber": "+919900000007",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "_id": ObjectId("6a0986443e64d4411066cb65"),
    "name": "Sneha Coach",
    "email": "sneha.coach@gmail.com",
    "password": "$2b$10$aII8/9NRrrO8sawgTXFLtuU4mEsHG.tDH8BnCLlvUEYfUcePoHS8i",
    "emailVerified": true,
    "role": "coach",
    "status": "active",
    "isDeleted": false,
    "isPhoneVerified": true,
    "phoneNumber": "+919900000008",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "_id": ObjectId("6a0986443e64d4411066cb66"),
    "name": "Karan Coach",
    "email": "karan.coach@gmail.com",
    "password": "$2b$10$aII8/9NRrrO8sawgTXFLtuU4mEsHG.tDH8BnCLlvUEYfUcePoHS8i",
    "emailVerified": true,
    "role": "coach",
    "status": "active",
    "isDeleted": false,
    "isPhoneVerified": true,
    "phoneNumber": "+919900000009",
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "_id": ObjectId("6a0986443e64d4411066cb67"),
    "name": "Neha Coach",
    "email": "neha.coach@gmail.com",
    "password": "$2b$10$aII8/9NRrrO8sawgTXFLtuU4mEsHG.tDH8BnCLlvUEYfUcePoHS8i",
    "emailVerified": true,
    "role": "coach",
    "status": "active",
    "isDeleted": false,
    "isPhoneVerified": true,
    "phoneNumber": "+919900000010",
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
];

print("🌱 Seeding coach users...");
coaches.forEach(coach => {
  db.getCollection('users').updateOne(
    { _id: coach._id },
    { $set: coach },
    { upsert: true }
  );
});
print("✅ Coach users seeding complete.");

// ==========================================
// 2. Generate and Seed Teams dynamically
// ==========================================
const tournaments = db.getCollection('tournaments').find({}).toArray();
print(`🌱 Found ${tournaments.length} tournaments. Generating 8 teams for each...`);

let teamSeedingSuccess = 0;
tournaments.forEach(tournament => {
  const teamIds = [];
  
  // Create exactly 8 teams, coached by coaches[0] to coaches[7]
  for (let i = 0; i < 8; i++) {
    try {
      const coach = coaches[i];
      
      // Look up sport name for a readable team name
      let sportDoc = db.getCollection('sports').findOne({ _id: ObjectId(tournament.sportId) });
      const sportName = sportDoc ? sportDoc.name : "Sport";
      
      const teamName = `${coach.name}'s ${sportName} squad`;
      
      // Generate a deterministic team ID using the coach and tournament ID parts to support idempotence
      const coachHex = coach._id.toString();
      const tournamentHex = tournament._id.toString();
      const deterministicHex = coachHex.substring(12) + tournamentHex.substring(12);
      const teamId = ObjectId(deterministicHex);

      const teamDoc = {
        _id: teamId,
        teamName: teamName,
        tournamentId: ObjectId(tournament._id),
        sportId: ObjectId(tournament.sportId),
        captainId: ObjectId(coach._id),
        players: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0
      };
      
      db.getCollection('teams').updateOne(
        { _id: teamId },
        { $set: teamDoc },
        { upsert: true }
      );
      
      teamIds.push(teamId);
      teamSeedingSuccess++;
    } catch (err) {
      print(`❌ Error generating team ${i} for tournament ${tournament.eventName}: ${err}`);
    }
  }
  
  // Update tournament with these team IDs
  db.getCollection('tournaments').updateOne(
    { _id: ObjectId(tournament._id) },
    { $set: { teams: teamIds } }
  );
});

print(`✅ Seeding complete. Generated and seeded ${teamSeedingSuccess} teams total across all tournaments.`);
