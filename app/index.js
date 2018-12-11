import document from "document";
import { me as device } from "device";
import { display } from "display";
import {fitbit_animate} from 'fitbit-animate';  //importing animation library

let intervals = []; // array to hold setIntervals for star animation
var nStars = 16; // number of stars

// main function that kicks off animation
function animate_stars() {

    // center of the screen
    const centerX = device.screen.width/2;
    const centerY = device.screen.height/2;

    // max distance a star can travel
    const maxD = Math.sqrt(centerX * centerX + centerY * centerY) + 40;

    // full t=time it takes star to travel from center of the scren to max distance
    const maxDuration = 2000;

    let star;
    let angle;
    let start_distance;

    // looping thru stars creating animation sequence
    for (let i=0; i<nStars; ++i) {
        star = document.getElementById(`star${i}`).getElementById('gr'); // getting hold of star GUI element
        angle = Math.PI * 2 * Math.random();    // random angle at witch star will travel
        start_distance = maxD * Math.random();  // random distance from center star begins travel from

        // starting intial animation from random position to max distance
        fitbit_animate([
            {
                elem:star,
                prop: 'translate',
                subprop: 'x',
                from: centerX + start_distance * Math.sin(angle),
                to: centerX + maxD * Math.sin(angle),
                dur: maxDuration*(maxD - start_distance)/maxD
            },
            {
                elem:star,
                prop: 'translate',
                subprop: 'y',
                from: centerY + start_distance * Math.cos(angle),
                to: centerY + maxD * Math.cos(angle),
                dur: maxDuration*(maxD - start_distance)/maxD
            },
            {
                elem:star,
                prop: 'scale',
                subprop: 'x',
                from: 2 * (1 - (maxD / (start_distance + maxD))),
                to: 1,
                dur: maxDuration*(maxD - start_distance)/maxD
            }
        ]).then((star_movement)=>{ // once initial animation complete - resetting star initial position to center
            star_movement[0].dur = maxDuration; star_movement[0].from = centerX;
            star_movement[1].dur = maxDuration; star_movement[1].from = centerY;
            star_movement[2].dur = maxDuration; star_movement[2].from = 0;

            fitbit_animate(star_movement); // showing first full animation right away 

            // and kicking off regular animation at duration interval (preserving setInterval's for future cancelations)
            intervals.push(

                    setInterval(() => {
                        fitbit_animate(star_movement);
                    }, maxDuration)

            )
        })

    }
}

// when display turned on/off
display.onchange = () => {
    if (display.on) { // if display turned on - start animation

      animate_stars()

    } else { // if display turned off - clearing all intervals, stopping all animations

      for (let i=0; i<nStars; i++) {
        clearInterval(intervals[i])
      }

      intervals.length = 0;

    }
  }

  // when application starts - start animations
  animate_stars();