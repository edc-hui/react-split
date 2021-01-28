import React from 'react';
import Split from "./Split";

const {Panel} = Split;

function App() {
    return (
        <div style={{width:'500px',height:'500px'}}>
            <Split mode="vertical">
                <Panel>
                    <div>1111</div>
                </Panel>
                <Panel>
                    <div>2222</div>
                </Panel>
            </Split>
        </div>
    );
}

export default App;
