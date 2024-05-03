import { useRef } from 'react';
import { PhaserGame } from './game/PhaserGame';

function App ()
{
    
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();


    return (
        <div id="app">
            <div className="rules">
                <p>Rules: You have 60 seconds to catch the stars. If you catch more than 60 stars, you win. If you catch fewer than 60 stars, you lose.</p>
            </div>
            <PhaserGame ref={phaserRef} currentActiveScene={null} />
        </div>
    )
}

export default App
