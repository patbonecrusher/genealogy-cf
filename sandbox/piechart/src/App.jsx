import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
/*
r1=40 = 40
t1=45 = 45
r2=200 = 200
t2=90 = 90

x1=r1*sin(t1) = 28.28
y1=r1*cos(t1) = 28.28

x2=r1*sin(t2) = 40
y2=r1*cos(t2) = 0

x3=r2*sin(t2) = 8.31
y3=r2*cos(t2) = 0

x4=r2*sin(t1) = 5.88
y4=r2*cos(t1) = 5.88

A 45 degree box around a circle of a 40px radius.
box is 160 pixel, so radius of end = 200.

divide 180degree by the number of box desired.
for each box calculate all 4 points

<path opacity="1" d="
M 28.28,-28.28              // start point
A 40,40, 0,0,0, 0,-40       // arc rx, ry, 0,0,shape, x, y
L 0,-200                    
A 200, 200, 0,0,1, 141.2,-141.2
Z" stroke-width="1" class="arc"></path>

    𝑥=𝑟∗𝑠𝑖𝑛(θ),𝑦=𝑟∗𝑐𝑜𝑠(θ) 
    θ = 90
    r = 40
    
*/

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
  
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }
  
  function describeArc(x, y, radius, start_angle, end_angle){
  
      var start = polarToCartesian(x, y, radius, end_angle);
      var end = polarToCartesian(x, y, radius, start_angle);
  
      var largeArcFlag = end_angle - start_angle <= 180 ? "0" : "1";
  
      var d = [
          "M", start.x, start.y, 
          "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
      ].join(" ");
  
      return d;       
  }

const PersonContainer = ({id, x, y, radius, start_angle, end_angle, width, transform}) => {
    // console.log(`${Number(x)}, ${y}`)
    const sStart = polarToCartesian(x, y, radius, end_angle);
    const sEnd = polarToCartesian(x, y, radius, start_angle);

    const lStart = polarToCartesian(x, y, radius + width, start_angle);
    const lEnd = polarToCartesian(x, y, radius + width, end_angle);
    
    const smallArcLength = Math.abs((2*Math.PI*radius)*(start_angle/360))
    const largeArcLength = Math.abs((2*Math.PI*(radius+width))*(start_angle/360))
    const fullLength = smallArcLength + largeArcLength + (width*2)
    const offsetPer  = ((smallArcLength/2)/fullLength)*100
    
    if (id === "0_0") {
        console.log('smmall', smallArcLength);
        console.log('large', largeArcLength);
        console.log('full', fullLength);
        console.log(offsetPer);
            
    }

    
    // console.log(`${sStart.x}, ${sStart.y}, ${sEnd.x}, ${sEnd.y}`)
    // console.log(`${lStart.x}, ${lStart.y}, ${lEnd.x}, ${lEnd.y}`)

    const path = `
    M ${sStart.x}, ${sStart.y}
    A ${radius},${radius}, 0,0,0, ${sEnd.x},${sEnd.y}
    L ${lStart.x},${lStart.y}
    A ${radius + width},${radius + width}, 0,0,1, ${lEnd.x}, ${lEnd.y}
    Z`
    
    
    // M 0,-40
    // A 40,40, 0,0,1, 40,0
    // L 200,0 
    // A 200, 200, 0,0,0, 0,-200

    
    return (
        <>
        <path key={id} id={id} opacity="1" d={path} strokeWidth="5" className="arc" transform={transform}/>
        {id === "0_0" &&
            <>
            <text key="0_0_name" id="0_0_name" width="500" height="200" className="name-part-1" transform="rotate(0)" dy="60">
                <textPath startOffset={`${offsetPer+50}%`} xlinkHref="#0_0" textAnchor="middle" fontSize="1.7em">Jean-Claude Laplante</textPath>
            </text>        
            <text key="0_0_date" id="0_0_date" width="500" height="200" className="name-part-1" transform="rotate(0)" dy="90">
                <textPath startOffset={`${offsetPer+50}%`} xlinkHref="#0_0" textAnchor="middle" fontSize="1.5em">1943 - </textPath>
            </text>        
            </>
        }
        </>
    )
};

const PersonLayer = ({id, level, width, totalAngle, radius}) => {
    
    const count = 2 ** level
    const angle_gap = totalAngle/count
    const start_angle = 0-(totalAngle/2)
    
    //console.log(angle)
    let angle = start_angle

    let p = [];
    for (let i=0; i<count; ++i) {
        p.push({
            id: `${id}_${i}`,
            x: 0,
            y: 0,
            radius: radius,
            start_angle: angle,
            end_angle: angle + angle_gap,
            width: width,
            transform: "translate(0,0)"
        })
        angle = angle+angle_gap
    }

    return (
        <g key={`${id}`}>
            {p.map(PersonContainer)}
        </g>
    )
};

const PieChart = ({levels, startRadius, angle, children}) => {
    // console.log(levels)
    const [layers, setLayers] = useState([])
    const [chartWidth, setChartWidth] = useState(1000)
    const [ta, setTa] = useState(0)
    console.log(levels)

    useEffect(() => {
        setTa(angle)
      }, [angle]); 
    
    useEffect(() => {
        const chartWidth = levels.length ? (levels.reduce((partialSum, a) => partialSum + a, 0) + startRadius)*2 : 10;
        // console.log(chartWidth)
        // console.log(chartWidth/2)
        setChartWidth(chartWidth)

    }, [levels])

    useEffect(() => {
        let p = []
        let r = startRadius;
        for (let i=0;i<levels.length; i++) {
            console.log(`${i} ${r}`)
            p.push({
                id: i,
                level: i+1,
                width: levels[i],
                totalAngle: ta,
                radius: r
            })
            r += levels[i]
        }
        console.log(p)
        setLayers(p)
    }, [ta, levels])

    
    return (
        <svg width={`${chartWidth}px`} height={`${chartWidth}px`} 
             viewBox={`${0-(chartWidth/2)} ${0-(chartWidth/2)} ${chartWidth} ${chartWidth}`}
             xmlns="http://www.w3.org/2000/svg" version="1.1">

            <rect x={`${0 - (chartWidth/2)}`} y={`${0 - (chartWidth/2)}`} width="100%" height="100%" fill="purple" stroke="blue" />
            <circle id="c" cy="0" cx="0" r={startRadius} strokeWidth="5" stroke="white" fill="white" />
            {layers.map(PersonLayer)}
            {children}
        </svg>
    )
    
}
  
function App() {
    const l = [200, 200, 200, 150, 150, 150, 150, 150]
    const [count, setCount] = useState(0)
    const [valuetext, setValuetext] = useState("10")
    const [startAngle, setStartAngle] = useState(270)
    const [levels, setLevels] = useState(l)
    
    const onChange = (e) => setStartAngle(e.target.value)
    const onChangeLevelCount = (e) => setLevels(l.splice(0, e.target.value))

    return (
        <div className="App">
      <Button variant="contained">Hello World</Button>
      
      

            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src="/vite.svg" className="logo" alt="Vite logo" />
                </a>
                <a href="https://reactjs.org" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
            
            <Slider aria-label="Temperature" defaultValue={30} valueLabelDisplay="auto"
                    step={1} marks min={3} max={8} onChange={onChangeLevelCount} />
            <Slider defaultValue={270} valueLabelDisplay="auto" 
                    step={2} marks min={180} max={360} onChange={onChange} />
            
            <PieChart levels={levels} startRadius={125} angle={startAngle}>
            <g>
                <text id="text_2" className="name-part-1" transform="rotate(0)" dy="21">
                    <textPath startOffset="25%" >Jean-Claude</textPath>
                </text>
                </g>
            </PieChart> 

        </div>
    )
}

// {/* <textPath xlink:href="#person_2" startOffset="25%" data-pid="GCNL-G6L" data-test="namePart1_2" id="textPathFirst_2" class="" style={"display: block; text-anchor: middle;"}>Jean-Claude</textPath> */}

export default App

{/* <svg viewBox="0 0 500 500">
  <path id="curve" d="M73.2,148.6c4-6.1,65.5-96.8,178.6-95.6c111.3,1.2,170.8,90.3,175.1,97" />
  <text width="500"  height="500">
    <textPath xlinkHref="#curve">
      Dangerous Curves Ahead
    </textPath>
  </text>
</svg> */}
