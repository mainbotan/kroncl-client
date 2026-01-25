import { GridSlide } from "./slides/grid/slide";
import { StartSlide } from "./slides/start/slide";
import { TwoSidesSlide } from "./slides/two-sides/slide";

export default function Page() {
    return (
        <>
        <StartSlide />
        <TwoSidesSlide />
        </>
    )
}