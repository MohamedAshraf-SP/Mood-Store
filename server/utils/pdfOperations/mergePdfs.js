import { PDFDocument } from 'pdf-lib';
export const mergeBase64PDFs = async (base64PDFs) => {
    try {
        console.log(base64PDFs);

        if (!Array.isArray(base64PDFs) || base64PDFs.length === 0) {
            return "No PDFs provided"
        }

        // Create a new PDF document to merge all PDFs
        const mergedPdf = await PDFDocument.create();

        for (const base64content of base64PDFs) {
            // Decode Base64 content into a Buffer
            const pdfBuffer = Buffer.from(base64content, "base64");

            // Load the PDF into pdf-lib
            const pdfDoc = await PDFDocument.load(pdfBuffer);

            // Copy pages from the current PDF into the merged PDF
            const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }


        // Save the merged PDF to a buffer
        let mergedPdfBytes = await mergedPdf.save();

        return mergedPdfBytes
    } catch (error) {
        console.log(error)
    }
}
