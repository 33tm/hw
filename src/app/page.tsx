"use client"

import { useState } from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Credenza,
    CredenzaBody,
    CredenzaClose,
    CredenzaContent,
    CredenzaDescription,
    CredenzaFooter,
    CredenzaHeader,
    CredenzaTitle,
    CredenzaTrigger
} from "@/components/ui/credenza"

export default () => {
    const [disclaimer, setDisclaimer] = useState(true)
    const [population, setPopulation] = useState({ t: NaN, d: NaN, r: NaN })
    const [percentage, setPercentage] = useState({ p: 0, q: 0, pp: 0, pq2: 0, qq: 0 })

    const data = [
        [
            ["t", "Population"],
            ["d", "# Of Dominant"],
            ["r", "# Of Recessive"]
        ],
        [
            ["p", "Dom. Allele % (p)"],
            ["q", "Rec. Allele % (q)"],
            ["pp", "Homo. Dom. % (p^2)"],
            ["pq2", "Hetero. % (2pq)"],
            ["qq", "Homo. Rec. % (q^2)"]
        ]
    ]

    const updatePercentage = (reference: "p" | "q", value: number) => {
        const [p, q] = [...reference === "p" ? [value, 1 - value] : [1 - value, value]].map(x => +x.toFixed(2))
        setPercentage({
            p,
            q,
            pp: +(p ** 2).toFixed(2),
            pq2: +(2 * p * q).toFixed(2),
            qq: +(q ** 2).toFixed(2)
        })
    }

    return (
        <div className="flex flex-col space-y-1 mt-3">
            <p className="italic text-[#999] text-sm m-auto">Only <strong>one value</strong> needed from each section.</p>
            <div className="m-4 px-4 pb-4 border rounded-md">
                <form onSubmit={e => e.preventDefault()}>
                    {data[0].map(([reference, label]) => (
                        <div className="flex my-4" key={reference}>
                            <p className="ml-2 my-auto font-bold opacity-80">{label}</p>
                            <Input
                                type="number"
                                step="any"
                                className="w-[calc(100vw-250px)] ml-auto text-center md:text-left"
                                onChange={({ target }) => {
                                    if (reference === "t" && (population.d || population.r)) {
                                        updatePercentage(population.d ? "p" : "q", Math.sqrt((population.d || population.r) / parseFloat(target.value)))
                                    } else if (population.d && population.r && !percentage.p && !percentage.q) {
                                        updatePercentage(reference === "d" ? "p" : "q", Math.sqrt(parseFloat(target.value) / (population.d + population.r)))
                                    } else if (population.t) {
                                        updatePercentage(reference === "d" ? "p" : "q", Math.sqrt(parseFloat(target.value) / population.t))
                                    }
                                    setPopulation({
                                        ...population,
                                        [reference]: parseFloat(target.value)
                                    })
                                }}
                            />
                        </div>
                    ))}
                    <Separator />
                    {data[1].map(([reference, label]) => (
                        <div className="flex my-4" key={reference}>
                            <p className="ml-2 my-auto font-bold opacity-80">{label}</p>
                            <Input
                                type="number"
                                step="any"
                                className="w-[calc(100vw-250px)] ml-auto text-center md:text-left"
                                onChange={({ target }) => {
                                    const value = `${reference}`.length - 1 ? Math.sqrt(parseFloat(target.value)) : parseFloat(target.value)
                                    updatePercentage(`${reference}`[0] as "p" | "q", value)
                                }}
                                {...reference === "pq2" && { disabled: true, placeholder: "Automatic" }}
                            />
                        </div>
                    ))}
                    <Separator />
                    <Credenza>
                        <CredenzaTrigger asChild>
                            <Button variant="secondary" className="w-full" type="submit">Evaluate</Button>
                        </CredenzaTrigger>
                        <CredenzaContent>
                            <CredenzaHeader>
                                <CredenzaTitle>Output</CredenzaTitle>
                                <CredenzaDescription className="italic text-[#999] hover:underline">
                                    <a href="https://github.com/33tm/hw" target="__blank">
                                        github.com/33tm/hw
                                    </a>
                                </CredenzaDescription>
                            </CredenzaHeader>
                            <CredenzaBody className="font-bold space-y-2">
                                {
                                    !!Object.values(population).filter(x => x !== 0).length && (
                                        <div className="p-4 bg-primary rounded-md">
                                            <div className="flex flex-col">
                                                <div className="flex">
                                                    <p>Population</p>
                                                    <p className="ml-auto opacity-80">
                                                        {
                                                            population.t
                                                            || population.r + population.d
                                                            || +(population.d / percentage.p).toFixed(0)
                                                            || +(population.r / percentage.q).toFixed(0)
                                                            || 0
                                                        }
                                                    </p>
                                                </div>
                                                <div className="flex">
                                                    <p># Of Dominant</p>
                                                    <p className="ml-auto opacity-80">
                                                        {
                                                            population.d
                                                            || population.t - population.r
                                                            || population.t - population.d / percentage.p
                                                            || +(population.t * percentage.p).toFixed(0)
                                                            || +(population.r / percentage.q - population.r).toFixed(0)
                                                            || 0
                                                        }
                                                    </p>
                                                </div>
                                                <div className="flex">
                                                    <p># Of Recessive</p>
                                                    <p className="ml-auto opacity-80">
                                                        {
                                                            population.r
                                                            || population.t - population.d
                                                            || population.t - population.r / percentage.q
                                                            || +(population.t * percentage.q).toFixed(0)
                                                            || +(population.d / percentage.p - population.d).toFixed(0)
                                                            || 0
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                <div className="p-2 px-4 bg-primary rounded-md">
                                    <div className="flex flex-col">
                                        {
                                            Object.entries(percentage).map(([reference, value]) => {
                                                const label = data[1].filter(array => array.some(x => x === reference))[0][1].split(" ")
                                                return (
                                                    <div key={reference} className="flex">
                                                        <p>{label.slice(0, -1).join(" ")}</p>
                                                        <div className="flex ml-auto space-x-4">
                                                            <p>{label.pop()!.slice(1, -1)}</p>
                                                            <p className="opacity-80">
                                                                {
                                                                    value
                                                                    || (reference === "pq2" && percentage.p ** 2)
                                                                    || "0"
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </CredenzaBody>
                            <CredenzaFooter>
                                <CredenzaClose asChild>
                                    <Button variant="secondary">Close</Button>
                                </CredenzaClose>
                            </CredenzaFooter>
                        </CredenzaContent>
                    </Credenza>
                </form>
            </div>
            <Credenza open={disclaimer}>
                <CredenzaContent>
                    <CredenzaHeader>
                        <CredenzaTitle>
                            Not very well made
                        </CredenzaTitle>
                        <CredenzaDescription>
                            Use at your own risk :D
                        </CredenzaDescription>
                    </CredenzaHeader>
                    <CredenzaBody className="text-sm italic opacity-80 text-center sm:text-left">
                        Why not make it better~
                        <br></br>
                        <a
                            href="https://github.com/33tm/hw"
                            target="__blank"
                            className="hover:underline"
                        >
                            github.com/33tm/hw
                        </a>
                    </CredenzaBody>
                    <CredenzaFooter>
                        <CredenzaClose asChild>
                            <Button variant="secondary" onClick={() => setDisclaimer(false)}>
                                Ignore
                            </Button>
                        </CredenzaClose>
                    </CredenzaFooter>
                </CredenzaContent>
            </Credenza>
        </div>
    )
}