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
    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function describeArc(x, y, radius, start_angle, end_angle) {

    var start = polarToCartesian(x, y, radius, end_angle);
    var end = polarToCartesian(x, y, radius, start_angle);

    var largeArcFlag = end_angle - start_angle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;
}

// textLength="1000px" to text node actually is supported by chrome and not safari
// it does weird things.
const Event = ({ id, pathRef, kind, date, location, dy, offsetPer, letterSpacing }) => {
    return (
        <g>
            
            <text key={`${id}_${kind}_text`} id={`${id}_${kind}_text`} className="name-part-1" transform="rotate(0)" dy={dy}>
                {/* <textPath key={`${id}_${kind}_kind`} startOffset={`${offsetPer + 49}%`} xlinkHref={pathRef} textAnchor="end" fontSize="15px" letterSpacing={letterSpacing} fontWeight="bold">{kind}</textPath>
                <textPath key={`${id}_${kind}_date`} startOffset={`${offsetPer + 50}%`} xlinkHref={pathRef} textAnchor="left" fontSize="15px" letterSpacing={letterSpacing}>{date}</textPath> */}
                <textPath key={`${id}_${kind}_kind`} startOffset={`${offsetPer + 50}%`} xlinkHref={pathRef} textAnchor="middle" fontSize="12px" letterSpacing={letterSpacing}>
                <tspan style={{ font: 'bold', fill: 'red', fontWeight: 'bold' }}>{kind} </tspan>
                <tspan style={{ fill: 'red' }}> {date} </tspan>
            </textPath>
            </text>
            <text key={`${id}_${kind}_location`} id={`${id}_${kind}_location`} className="name-part-1" textAnchor="middle" letterSpacing={letterSpacing} transform="rotate(0)" dy={dy+20}>
                <textPath startOffset={`${offsetPer + 50}%`} xlinkHref={pathRef} fontSize="12px">{location}</textPath>
            </text>
        </g>
    )
}

const PersonContainer = ({ id, x, y, radius, start_angle, end_angle, width, transform }) => {
    // console.log(`${Number(x)}, ${y}`)
    const sStart = polarToCartesian(x, y, radius, end_angle);
    const sEnd = polarToCartesian(x, y, radius, start_angle);

    const lStart = polarToCartesian(x, y, radius + width, start_angle);
    const lEnd = polarToCartesian(x, y, radius + width, end_angle);

    const angle = Math.abs(end_angle - start_angle)
    const smallArcLength = Math.abs((2 * Math.PI * radius) * (angle / 360))
    const largeArcLength = Math.abs((2 * Math.PI * (radius + width)) * (angle / 360))
    const fullLength = smallArcLength + largeArcLength + (width * 2)
    const offsetPer = ((smallArcLength / 2) / fullLength) * 100

    if (id === "0_0" || id === "0_1") {
        console.log('radius', radius);
        console.log('angle', angle);
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
            <path key={id} id={id} opacity="1" d={path} strokeWidth="5" className="arc" transform={transform} />
            {id === "0_0" &&
                <>
                    <text key="0_0_name" id="0_0_name" width="500" height="200" textAnchor="middle" className="name-part-1" transform="rotate(0)" dy="60">
                        <textPath startOffset={`${offsetPer + 50}%`} xlinkHref="#0_0" fontSize="1.7em">Jean-Claude Laplante</textPath>
                    </text>
                    <text key="0_0_date" id="0_0_date" width="500" height="200" textAnchor="middle" className="name-part-1" transform="rotate(0)" dy="90">
                        <textPath startOffset={`${offsetPer + 50}%`} xlinkHref="#0_0" fontSize="1.5em">1943 - </textPath>
                    </text>
                </>
            }
            {id === "0_1" &&
                <>
                    <text key="0_1_name" id="0_0_name" width="500" height="200" className="name-part-1" textAnchor="middle" letterSpacing="3.0" transform="rotate(0)" dy="40">
                        <textPath startOffset={`${offsetPer + 50}%`} xlinkHref="#0_1" fontSize="20px" fontWeight="bold">Marie-Claire Phaneuf</textPath>
                    </text>
                    <Event id={`${id}_event_birth`}   pathRef="#0_1" kind="Birth" date="08/05/1943" location="Upton, Bagot, Québec, Canada" dy={80} offsetPer={offsetPer} letterSpacing={4}></Event>
                    <Event id={`${id}_event_baptism`} pathRef="#0_1" kind="Christening" date="08/06/1943" location="Upton, Bagot, Québec, Canada" dy={120} offsetPer={offsetPer} letterSpacing={6}></Event>
                    <Event id={`${id}_event_wedding`} pathRef="#0_1" kind="Marriage" date="06/28/1964 (21y 1m 16d)" location="Upton, Bagot, Québec, Canada" dy={160} offsetPer={offsetPer} letterSpacing={9}></Event>
                    <Event id={`${id}_event_wedding`} pathRef="#0_1" kind="Death" date="06/28/2034 (91y 1m 16d)" location="Upton, Bagot, Québec, Canada" dy={200} offsetPer={offsetPer} letterSpacing={12}></Event>
                    <Event id={`${id}_event_wedding`} pathRef="#0_1" kind="Burrial" date="06/28/2034 (91y 1m 16d)" location="Upton, Bagot, Québec, Canada" dy={240} offsetPer={offsetPer} letterSpacing={15}></Event>
                </>
            }
            {id === "1_1" &&
                <>
                    <text key="0_1_name" id="0_0_name" width="500" height="200" className="name-part-1" textAnchor="middle" letterSpacing="3.0" transform="rotate(0)" dy="40">
                        <textPath startOffset={`${offsetPer + 50}%`} xlinkHref="#1_1" fontSize="20px" fontWeight="bold">Marie-Claire Phaneuf</textPath>
                    </text>
                    <Event id={`${id}_event_birth`}   pathRef="#1_1" kind="Birth" date="08/05/1943" location="Upton, Bagot, Québec, Canada" dy={80} offsetPer={offsetPer} letterSpacing={4}></Event>
                    <Event id={`${id}_event_baptism`} pathRef="#1_1" kind="Christening" date="08/06/1943" location="Upton, Bagot, Québec, Canada" dy={120} offsetPer={offsetPer} letterSpacing={4}></Event>
                    <Event id={`${id}_event_wedding`} pathRef="#1_1" kind="Marriage" date="06/28/1964 (21y 1m 16d)" location="Upton, Bagot, Québec, Canada" dy={160} offsetPer={offsetPer} letterSpacing={4}></Event>
                    <Event id={`${id}_event_wedding`} pathRef="#1_1" kind="Death" date="06/28/2034 (91y 1m 16d)" location="Upton, Bagot, Québec, Canada" dy={200} offsetPer={offsetPer} letterSpacing={4}></Event>
                    <Event id={`${id}_event_wedding`} pathRef="#1_1" kind="Burrial" date="06/28/2034 (91y 1m 16d)" location="Upton, Bagot, Québec, Canada" dy={240} offsetPer={offsetPer} letterSpacing={4}></Event>
                </>
            }
            {id === "2_1" &&
                <>
                    <text key="0_1_name" id="0_0_name" width="500" height="200" className="name-part-1" textAnchor="middle" letterSpacing="3.0" transform="rotate(0)" dy="40">
                        <textPath startOffset={`${offsetPer + 50}%`} xlinkHref="#2_1" fontSize="20px" fontWeight="bold">Marie-Claire Phaneuf</textPath>
                    </text>
                    <Event id={`${id}_event_birth`}   pathRef="#2_1" kind="Birth" date="08/05/1943" location="Upton, Bagot, Québec, Canada" dy={80} offsetPer={offsetPer} letterSpacing={4}></Event>
                    <Event id={`${id}_event_baptism`} pathRef="#2_1" kind="Christening" date="08/06/1943" location="Upton, Bagot, Québec, Canada" dy={120} offsetPer={offsetPer} letterSpacing={4}></Event>
                    <Event id={`${id}_event_wedding`} pathRef="#2_1" kind="Marriage" date="06/28/1964 (21y 1m 16d)" location="Upton, Bagot, Québec, Canada" dy={160} offsetPer={offsetPer} letterSpacing={4}></Event>
                    <Event id={`${id}_event_wedding`} pathRef="#2_1" kind="Death" date="06/28/2034 (91y 1m 16d)" location="Upton, Bagot, Québec, Canada" dy={200} offsetPer={offsetPer} letterSpacing={4}></Event>
                    <Event id={`${id}_event_wedding`} pathRef="#2_1" kind="Burrial" date="06/28/2034 (91y 1m 16d)" location="Upton, Bagot, Québec, Canada" dy={240} offsetPer={offsetPer} letterSpacing={4}></Event>
                </>
            }
            {id === "3_1" &&
                <>
                    <text key="0_1_name" id="0_0_name" width="500" height="200" className="name-part-1" textAnchor="middle" letterSpacing="3.0" transform="rotate(0)" dy="40">
                        <textPath startOffset={`${offsetPer + 50}%`} xlinkHref="#3_1" fontSize="20px" fontWeight="bold">Marie-Claire Phaneuf</textPath>
                    </text>
                    <Event id={`${id}_event_birth`}   pathRef="#3_1" kind="Birth" date="08/05/1943" location="Upton, Bagot, Québec, Canada" dy={80} offsetPer={offsetPer} letterSpacing={4}></Event>
                    <Event id={`${id}_event_baptism`} pathRef="#3_1" kind="Christening" date="08/06/1943" location="Upton, Bagot, Québec, Canada" dy={120} offsetPer={offsetPer} letterSpacing={4}></Event>
                    <Event id={`${id}_event_wedding`} pathRef="#3_1" kind="Marriage" date="06/28/1964 (21y 1m 16d)" location="Upton, Bagot, Québec, Canada" dy={160} offsetPer={offsetPer} letterSpacing={4}></Event>
                    <Event id={`${id}_event_wedding`} pathRef="#3_1" kind="Death" date="06/28/2034 (91y 1m 16d)" location="Upton, Bagot, Québec, Canada" dy={200} offsetPer={offsetPer} letterSpacing={4}></Event>
                    <Event id={`${id}_event_wedding`} pathRef="#3_1" kind="Burrial" date="06/28/2034 (91y 1m 16d)" location="Upton, Bagot, Québec, Canada" dy={240} offsetPer={offsetPer} letterSpacing={4}></Event>
                </>
            }
            {id === "4_1" &&
                <>
                    <text key="0_1_name" id="0_0_name" width="500" height="200" className="name-part-1" textAnchor="middle" letterSpacing="3.0" transform="rotate(0)" dy="40">
                        <textPath startOffset={`${offsetPer + 50}%`} xlinkHref="#4_1" fontSize="20px" fontWeight="bold">Marie-Claire Phaneuf</textPath>
                    </text>
                    <Event id={`${id}_event_birth`}   pathRef="#4_1" kind="Birth" date="08/05/1943" location="Upton, Bagot, Québec, Canada" dy={80} offsetPer={offsetPer} letterSpacing={4}></Event>
                    <Event id={`${id}_event_baptism`} pathRef="#4_1" kind="Christening" date="08/06/1943" location="Upton, Bagot, Québec, Canada" dy={120} offsetPer={offsetPer} letterSpacing={4}></Event>
                    <Event id={`${id}_event_wedding`} pathRef="#4_1" kind="Marriage" date="06/28/1964 (21y 1m 16d)" location="Upton, Bagot, Québec, Canada" dy={160} offsetPer={offsetPer} letterSpacing={4}></Event>
                    <Event id={`${id}_event_wedding`} pathRef="#4_1" kind="Death" date="06/28/2034 (91y 1m 16d)" location="Upton, Bagot, Québec, Canada" dy={200} offsetPer={offsetPer} letterSpacing={4}></Event>
                    <Event id={`${id}_event_wedding`} pathRef="#4_1" kind="Burrial" date="06/28/2034 (91y 1m 16d)" location="Upton, Bagot, Québec, Canada" dy={240} offsetPer={offsetPer} letterSpacing={4}></Event>
                </>
            }
        </>
    )
};

const PersonLayer = ({ id, level, width, totalAngle, radius }) => {

    const count = 2 ** level
    const angle_gap = totalAngle / count
    // const start_angle = -90 - (totalAngle / 2)
    const start_angle = 0 - (totalAngle / 2)

    //console.log(angle)
    let angle = start_angle

    let p = [];
    for (let i = 0; i < count; ++i) {
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
        angle = angle + angle_gap
    }

    return (
        <g key={`${id}`}>
            {p.map(PersonContainer)}
        </g>
    )
};

const PieChart = ({ levels, startRadius, angle, children }) => {
    // console.log(levels)
    const [layers, setLayers] = useState([])
    const [chartWidth, setChartWidth] = useState(1000)
    const [ta, setTa] = useState(0)
    console.log(levels)

    useEffect(() => {
        setTa(angle)
    }, [angle]);

    useEffect(() => {
        const chartWidth = levels.length ? ((levels.reduce((partialSum, a) => partialSum + a, 0) + startRadius) + 100) * 2 : 10;
        // console.log(chartWidth)
        // console.log(chartWidth/2)
        setChartWidth(chartWidth)

    }, [levels])

    useEffect(() => {
        let p = []
        let r = startRadius;
        for (let i = 0; i < levels.length; i++) {
            console.log(`${i} ${r}`)
            p.push({
                id: i,
                level: i + 1,
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
            viewBox={`${0 - (chartWidth / 2)} ${0 - (chartWidth / 2)} ${chartWidth} ${chartWidth}`}
            xmlns="http://www.w3.org/2000/svg" version="1.1">

            <rect x={`${0 - (chartWidth / 2)}`} y={`${0 - (chartWidth / 2)}`} width="100%" height="100%" fill="purple" stroke="blue" />
            <circle id="c" cy="0" cx="0" r={startRadius} strokeWidth="5" stroke="white" fill="white" />
            {layers.map(PersonLayer)}
            {children}
        </svg>
    )

}

function App() {
    const l = [300, 300, 300, 300, 300, 150, 150, 150]
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
