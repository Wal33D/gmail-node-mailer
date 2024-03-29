## `sendEmail` Function Parameters and Response Types

When using the `sendEmail` function, you will interact with two interfaces: `ISendEmailParams` and `ISendEmailResponse`.

````typescript
export interface ISendEmailParams {
    recipientEmail: string;
    senderEmail: string;
    subject: string;
    message: string;
}
````

````typescript
export interface ISendEmailResponse {
    sent: boolean;
    status: number | null;
    statusText: string | null;
    responseUrl: string | null;
    message: string;
    gmailResponse: any | null;
}
````

Using these interfaces, you can define the structure of the data passed to the `sendEmail` function and the structure of the response returned from it.

[Back to main README](../README.md)
