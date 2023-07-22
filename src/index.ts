import figlet from "figlet";
import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import fetch from "node-fetch";
import ora from "ora";

// type module means have to specify js
import {
    type IncomeInfo,
    isTypeTaxResponse,
    isTypeErrorResponse,
} from "./types/types.js";

console.clear();
console.log(
    chalk.blueBright(
        figlet.textSync("Tax Calculator"),
        "\n   Built for Visual Cortex",
    ),
);

const program = new Command();
const url = "http://localhost:8080/api/calculate";

program
    .name("visual-cortex-tax-calculator")
    .version("1.0.0")
    .description(
        "A simple tax calculator CLI, for interfacing with a node server.",
    )
    .parse(process.argv);

inquirer
    .prompt([
        {
            type: "list",
            name: "year",
            message: "Please select the income year:",
            choices: ["2020-2021", "2021-2022", "2022-2023", "2023-2024"],
        },
        {
            type: "input",
            name: "income",
            message:
                "Please enter your total taxable income for the full income year:",
            validate: (taxableIncome) => {
                const number = Number(taxableIncome);
                if (!number || taxableIncome < 0) {
                    return "Please enter a valid number greater than 0.";
                }
                return true;
            },
        },
    ])
    .then(async (answers) => {
        const incomeInfo: IncomeInfo = {
            year: answers.year,
            income: Number(answers.income),
        };

        let resultString = "";
        const spinner = ora("Making request...").start();
        spinner.color = "cyan";
        const result = await getTax(incomeInfo);
        spinner.stop();

        if (typeof result === "object") {
            if (result && isTypeTaxResponse(result)) {
                resultString = chalk.green(
                    `The estimated tax on your taxable income is ${result.tax}`,
                );
            } else if (result && isTypeErrorResponse(result)) {
                resultString = chalk.red(`An Error occurred: ${result.error}`);
            } else {
                resultString = "Unexpected response has occurred.";
            }
        }

        console.log(resultString);
    });

async function getTax(incomeInfo: IncomeInfo) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(incomeInfo),
        });
        const body = await response.json();
        return body;
    } catch (error) {
        console.error(chalk.red("A network error occurred: "), error);
    }
}
// dockerfile for backend
// gcp hosting
