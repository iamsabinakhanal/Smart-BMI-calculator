// import React from 'react';

// import Fitness from "../styles/Fitness.css"
// import hips from "../assets/images/hips.png"
// import arm from "../assets/images/arm.png"

// import chest from "../assets/images/chest.png"
// import legs from "../assets/images/legs.png"
// import thigh from "../assets/images/thigh.png"
// import waist from "../assets/images/waist.png"
// const Fitness = () => {
//   const handleShowNext = (bodyPart) => {
//     alert(`Next screen for: ${bodyPart}`);
//     // Replace alert with navigation or other logic
//   };

//   const cards = [
//     {
//       label: 'Hips',
//       imgSrc: {hips},
//       alt: 'Hips'
//     },
//     {
//       label: 'Thighs',
//       imgSrc: {thigh},
//       alt: 'Thighs'
//     },
//     {
//       label: 'Bust',
//       imgSrc: {chest},
//       alt: 'Bust'
//     },
//     {
//       label: 'Arms',
//       imgSrc: {arm},
//       alt: 'Arms'
//     },
//     {
//       label: 'Legs',
//       imgSrc: {legs},
//       alt: 'Legs'
//     },
//     {
//       label: 'Waist',
//       imgSrc: {waist},
//       alt: 'Waist'
//     },
//   ];

//   return (
//     <div className="fitness-container">
//       <h2 className="header">Select a Body Part for Exercises</h2>
//       <div className="cards-container">
//         {cards.map((card) => (
//           <div
//             key={card.label}
//             className="card"
//             onClick={() => handleShowNext(card.label)}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.transform = 'scale(1.05)';
//               e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = 'scale(1)';
//               e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
//             }}
//           >
//             <img src={card.imgSrc} alt={card.alt} />
//             <span>{card.label}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Fitness;



import React from 'react';
import '../styles/Fitness.css'; // Correct CSS import
import hips from "../assets/images/hips.png";
import arm from "../assets/images/arm.png";
import chest from "../assets/images/chest.png";
import legs from "../assets/images/legs.png";
import thigh from "../assets/images/thigh.png";
import waist from "../assets/images/waist.png";

const Fitness = () => {
  const handleShowNext = (bodyPart) => {
    alert(`Next screen for: ${bodyPart}`);
    // Replace alert with navigation logic if needed
  };

  const cards = [
    { label: 'Hips', imgSrc: hips, alt: 'Hips' },
    { label: 'Thighs', imgSrc: thigh, alt: 'Thighs' },
    { label: 'Bust', imgSrc: chest, alt: 'Bust' },
    { label: 'Arms', imgSrc: arm, alt: 'Arms' },
    { label: 'Legs', imgSrc: legs, alt: 'Legs' },
    { label: 'Waist', imgSrc: waist, alt: 'Waist' },
  ];

  return (
    <div className="fitness-container">
      <h2 className="header">Select a Body Part for Exercises</h2>
      <div className="cards-container">
        {cards.map((card) => (
          <div
            key={card.label}
            className="card"
            onClick={() => handleShowNext(card.label)}
          >
            <img src={card.imgSrc} alt={card.alt} />
            <span>{card.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fitness;
