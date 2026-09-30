import React from 'react';

const baseGreetings = [
  { text: 'Hello!', lang: 'English' },
  { text: '•', lang: '' },
  { text: '你好！', lang: 'Mandarin' },
  { text: '•', lang: '' },
  { text: 'مرحبا!', lang: 'Arabic' },
  {text: '•', lang: '' },
 { text: '안녕하세요!', lang: 'Korean' },
 { text: '•', lang: '' },
  { text: 'Halo!', lang: 'Indonesian' },
  { text: '•', lang: '' },
  { text: 'どうも!', lang: 'Japanese' },
  //{ text: 'こんにちは！', lang: 'Japanese' },
  { text: '•', lang: '' },
];

// Duplicate the greetings to create 12 items. 
// A 12-sided shape looks much more like a round globe than a 6-sided box.
const greetings = [...baseGreetings, ...baseGreetings];

const Greeting3D = () => {
  const numItems = greetings.length;
  const angleStep = 360 / numItems;
  const radius = 200;

  return (
    <div className="greeting-3d-wrapper">
      <div className="greeting-3d-container">
        {/* <div className="greeting-3d-wobble"> */}
          <div className="greeting-3d-carousel">
            {greetings.map((greeting, i) => (
              <div
                key={i}
                className="greeting-3d-item"
                style={{
                  transform: `rotateY(${i * angleStep}deg) translateZ(${radius}px)`,
                }}
              >
                <span className="greeting-3d-text">{greeting.text}</span>
              </div>
            ))}
          </div>
        {/* </div> */}
      </div>
    </div>
  );
};

export default Greeting3D;