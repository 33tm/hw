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
    console.log(percentage, population)

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
                                onChange={({ target }) => setPopulation({
                                    ...population,
                                    [reference]: parseFloat(target.value)
                                })}
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
                                <CredenzaDescription className="italic text-[#999]">
                                    Zero&apos;s may render as question marks
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
                                                            || "?"
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
                                                            || "?"
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
                                                            || "?"
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
                                                            <p className="opacity-80">{value || "?"}</p>
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
        </div>
    )
}