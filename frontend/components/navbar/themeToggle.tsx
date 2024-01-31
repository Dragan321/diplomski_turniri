"use client"

import { useTheme } from "next-themes"
import { Player } from '@lottiefiles/react-lottie-player';
import { useRef } from "react";


export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const player = useRef<Player>(null)
    function switchTheme() {
        if (theme == "dark") {
            setTheme("light")
            player.current?.setPlayerDirection(-1)
            player.current?.play();
        }
        else {
            setTheme("dark")
            player.current?.setPlayerDirection(1)
            player.current?.play();
            //TODO: gotoandplay za malo vise smooth tranzicije ima i min imax frame
        }
    }
    //TODO:set width
    return (
        <div onClick={switchTheme} >

            <Player style={{ height: '5rem' }} ref={player} autoplay keepLastFrame speed={2} src={"/theme_switch_animation.json"} />
        </div>
    )
}
