import { useEffect, useState } from "react"
import {
    Button,
    Input,
    Separator,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "valkoma-package/primitive"
import { evaluate } from "mathjs"
import {
    Plus,
    Minus,
    Divide,
    X,
    Pi,
    Save,
    CircleX,
} from "lucide-react"

type CalcItem = {
    value: string
    time: string
}

export const Calculator = () => {
    const [expression, setExpression] = useState("")
    const [history, setHistory] = useState<CalcItem[]>([])
    const [saved, setSaved] = useState<CalcItem[]>([])

    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

    // Operators with icons
    const operators = [
        { symbol: "+", Icon: Plus },
        { symbol: "-", Icon: Minus },
        { symbol: "*", Icon: X },
        { symbol: "/", Icon: Divide },
    ]

    // Scientific buttons — icons where available, otherwise text
    const scientificButtons = [
        { label: "(", icon: null },
        { label: ")", icon: null },
        { label: "π", icon: Pi },
        { label: "e", icon: null },
        { label: "sin", icon: null },
        { label: "cos", icon: null },
        { label: "tan", icon: null },
        { label: "asin", icon: null },
        { label: "acos", icon: null },
        { label: "atan", icon: null },
        { label: "sqrt", icon: null },
        { label: "log", icon: null },
        { label: "ln", icon: null },
        { label: "^", icon: null },
        { label: "!", icon: null },
        { label: "exp", icon: null },
    ]

    const appendValue = (value: string) => {
        if (value === "π") {
            setExpression((prev) => prev + "pi")
        } else if (value === "e") {
            setExpression((prev) => prev + "e")
        } else {
            setExpression((prev) => prev + value)
        }
    }

    const getCurrentTime = () =>
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    const clear = () => setExpression("")

    const calculate = () => {
        try {
            const result = evaluate(expression).toString()
            const newEntry: CalcItem = {
                value: `${expression} = ${result}`,
                time: getCurrentTime(),
            }
            setHistory((prev) => [newEntry, ...prev])
            setExpression(result)
        } catch {
            setExpression("Error")
        }
    }

    const saveExpression = () => {
        if (!expression) return
        const alreadySaved = saved.some((item) => item.value === expression)
        if (!alreadySaved) {
            const newSaved: CalcItem = {
                value: expression,
                time: getCurrentTime(),
            }
            setSaved((prev) => [newSaved, ...prev])
        }
    }

    const deleteSaved = (value: string) => {
        setSaved((prev) => prev.filter((item) => item.value !== value))
    }

    const loadItem = (value: string) => {
        setExpression(value.includes("=") ? value.split("=")[0].trim() : value)
    }

    useEffect(() => {
        const savedHistory = localStorage.getItem("calculator-history")
        const savedSaved = localStorage.getItem("calculator-saved")
        if (savedHistory) setHistory(JSON.parse(savedHistory))
        if (savedSaved) setSaved(JSON.parse(savedSaved))
    }, [])

    useEffect(() => {
        localStorage.setItem("calculator-history", JSON.stringify(history))
    }, [history])

    useEffect(() => {
        localStorage.setItem("calculator-saved", JSON.stringify(saved))
    }, [saved])

    return (
        <div className="p-10 pt-20 flex gap-4 items-stretch justify-center h-screen">
            <div className="flex flex-col gap-4 max-w-xl p-10 w-full max-w-md h-full">
                <div className="flex gap-4">
                    <Input className="w-full text-right text-xl" readOnly value={expression} />
                    <Button size='icon' onClick={saveExpression}>
                        <Save />
                    </Button>
                </div>
                <div className="flex gap-4 w-full">
                    {/* Number buttons: take 3/4 of the width */}
                    <div className="grid grid-cols-3 gap-4 flex-grow">
                        {numbers.map((n) => (
                            <Button
                                key={n}
                                variant="outline"
                                className="w-full"
                                onClick={() => appendValue(n.toString())}
                            >
                                {n}
                            </Button>
                        ))}
                        <Button className="w-full" onClick={clear}>
                            C
                        </Button>
                        <Button className="w-full" onClick={calculate}>
                            =
                        </Button>
                    </div>

                    {/* Operator buttons: take 1/4 of the width */}
                    <div className="grid grid-cols-1 gap-4" style={{ width: '25%' }}>
                        {operators.map(({ symbol, Icon }) => (
                            <Button
                                key={symbol}
                                className="w-full"
                                onClick={() => appendValue(symbol)}
                            >
                                <Icon className="h-5 w-5" />
                            </Button>
                        ))}
                    </div>
                </div>

                <Separator />
                {/* Scientific buttons */}
                <div className="grid grid-cols-4 gap-4">
                    {scientificButtons.map(({ label, icon: Icon }) => (
                        <Button
                            key={label}
                            size="sm"
                            variant="secondary"
                            className="w-full text-xs flex justify-center items-center gap-1"
                            onClick={() => appendValue(label)}
                            aria-label={label}
                        >
                            {Icon ? <Icon className="h-4 w-4" /> : label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* History & Saved */}
            <div className="w-[400px] p-4 flex flex-col">
                <div className="flex w-full max-w-sm h-[435px] flex-col gap-6">
                    <Tabs defaultValue="history" className="h-full">
                        <TabsList>
                            <TabsTrigger value="history">History</TabsTrigger>
                            <TabsTrigger value="saved">Saved</TabsTrigger>
                        </TabsList>

                        {/* History Tab */}
                        <TabsContent
                            value="history"
                            className="bg-muted h-full p-4 text-right overflow-auto"
                        >
                            {history.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center">No history</p>
                            ) : (
                                <ul className="flex flex-col gap-3">
                                    {history.map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center justify-between text-sm gap-2"
                                        >
                                            <button
                                                onClick={() => loadItem(item.value)}
                                                className="text-blue-600 hover:underline text-left truncate"
                                            >
                                                {item.value}
                                            </button>
                                            <span className="text-xs text-gray-500">{item.time}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </TabsContent>

                        {/* Saved Tab */}
                        <TabsContent
                            value="saved"
                            className="bg-muted h-full p-4 text-right overflow-auto"
                        >
                            {saved.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center">
                                    No saved expressions
                                </p>
                            ) : (
                                <ul className="flex flex-col gap-3">
                                    {saved.map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center justify-between text-sm gap-2"
                                        >
                                            <div className="flex-1 text-left">
                                                <button
                                                    onClick={() => loadItem(item.value)}
                                                    className="text-blue-600 hover:underline truncate"
                                                >
                                                    {item.value}
                                                </button>
                                                <div className="text-xs text-gray-500">{item.time}</div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => deleteSaved(item.value)}
                                            >
                                                <CircleX />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div >
    )
}
