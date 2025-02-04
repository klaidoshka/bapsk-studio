using System.Security.AccessControl;
using Account.Services;
using Accounting.Contract.Sti;
using Accounting.Contract.Sti.Data;
using Accounting.Services.Util;

namespace Accounting.Services.Sti.Mapping;

public static class SubmitDeclaration
{
    public static submitDeclarationRequest ToExternalType(this SubmitDeclarationRequest request)
    {
        return new submitDeclarationRequest
        {
            Declaration = request.Declaration.ToExternalType(),
            RequestId = request.RequestId,
            SenderIn = request.SenderIn,
            Situation = request.Situation,
            TimeStamp = request.TimeStamp
        };
    }

    private static TFDeclaration_Type ToExternalType(this Contract.Sti.Data.SubmitDeclaration type)
    {
        return new TFDeclaration_Type
        {
            Customer = type.Customer.ToExternalType(),
            DocHeader = type.Header.ToExternalType(),
            Intermediary = type.Intermediary.ToExternalType(),
            Salesman = type.Salesman.ToExternalType(),
            SalesDocument = type.SalesDocuments.ToExternalType()
        };
    }

    private static Customer_Type ToExternalType(this Customer customer)
    {
        return new Customer_Type
        {
            BirthDate = customer.BirthDate,
            FirstName = customer.FirstName,
            IdentityDocument = customer.IdentityDocument.ToExternalType(),
            Item = (customer.ResidentCountryCode?.ConvertToEnum<NonEuCountryCode_Type>() as object) 
                   ?? customer.ResidentTerritory?.ToExternalType(),
            LastName = customer.LastName,
            OtherDocument = customer.OtherDocument.ToExternalType(),
            PersonIn = customer.PersonId.ToExternalType()
        };
    }

    private static IdentityDocument_Type ToExternalType(this IdentityDocument document)
    {
        return new IdentityDocument_Type
        {
            DocNo = new IdDocNo_Type
            {
                issuedBy = document.DocumentNo.IssuedBy.ConvertToEnum<IsoCountryCode_Type>(),
                Value = document.DocumentNo.Value
            },
            DocType = document.DocumentType
        };
    }
    
    private static Customer_TypeResTerritory ToExternalType(this CustomerResTerritory territory)
    {
        return new Customer_TypeResTerritory
        {
            TerritoryCode = territory.TerritoryCode,
            TerritoryName = territory.TerritoryName
        };
    }

    private static OtherDocument_Type[] ToExternalType(this IReadOnlyList<OtherDocument> documents)
    {
        return documents
            .Select(document => new OtherDocument_Type
            {
                DocNo = new OtherDocNo_Type
                {
                    issuedBy = document.DocumentNo.IssuedBy.ConvertToEnum<IsoCountryCode_Type>(),
                    Value = document.DocumentNo.Value
                },
                DocType = document.DocumentType
            })
            .ToArray();
    }

    private static PersonIn_Type ToExternalType(this PersonIn personIn)
    {
        return new PersonIn_Type
        {
            issuedBy = personIn.IssuedBy.ConvertToEnum<IsoCountryCode_Type>(),
            Value = personIn.Value
        };
    }

    private static DocHeader_Type ToExternalType(this DocumentHeader header)
    {
        return new DocHeader_Type
        {
            Affirmation = header.Affirmation.ConvertToEnum<DocHeader_TypeAffirmation>(),
            CompletionDate = header.CompletionDate,
            DocCorrNo = header.DocumentCorrectionNo,
            DocId = header.DocumentId
        };
    }

    private static Intermediary_Type ToExternalType(this Intermediary intermediary)
    {
        return new Intermediary_Type
        {
            IntermediaryIn = intermediary.IntermediaryId,
            Name = intermediary.Name
        };
    }

    private static SalesMan_Type ToExternalType(this Salesman salesman)
    {
        return new SalesMan_Type
        {
            Name = salesman.Name,
            VatPayerCode = salesman.VatPayerCode.ToExternalType()
        };
    }

    private static LtVatPayerCode_Type ToExternalType(this LtVatPayerCode code)
    {
        return new LtVatPayerCode_Type
        {
            issuedBy = code.IssuedBy.ConvertToEnum<IsoCountryCode_Type>(),
            Value = code.Value
        };
    }

    private static SalesDocument_Type[] ToExternalType(this IReadOnlyList<SalesDocument> documents)
    {
        return documents
            .Select(document => new SalesDocument_Type
            {
                Goods = document.Goods.ToExternalType(),
                Item = (document.CashRegisterReceipt?.ToExternalType() as object) ?? document.InvoiceNo,
                SalesDate = document.SalesDate
            })
            .ToArray();
    }

    private static GoodsItem_Type[] ToExternalType(this IReadOnlyList<Goods> goods)
    {
        return goods
            .Select(g => new GoodsItem_Type
            {
                Description = g.Description,
                Item = g.Item,
                ItemElementName = g.ItemElementName.ConvertToEnum<ItemChoiceType>(),
                Quantity = g.Quantity,
                SequenceNo = g.SequenceNo,
                TaxableAmount = g.TaxableAmount,
                TotalAmount = g.TotalAmount,
                VatAmount = g.VatAmount,
                VatRate = g.VatRate
            })
            .ToArray();
    }
    
    private static CashRegisterReceipt_Type ToExternalType(this CashRegisterReceipt receipt)
    {
        return new CashRegisterReceipt_Type
        {
            CashRegisterNo = receipt.CashRegisterNo,
            ReceiptNo = receipt.ReceiptNo
        };
    }

    public static SubmitDeclarationResponse ToInternalType(this submitDeclarationResponse1 response)
    {
        return new SubmitDeclarationResponse
        {
            DeclarationState = response.submitDeclarationResponse.DeclState
                .ConvertToEnum<SubmitDeclarationState>(),
            DeclarationStateSpecified = response.submitDeclarationResponse.DeclStateSpecified,
            Errors = response.submitDeclarationResponse.Errors.ToInternalType(),
            ResultDate = response.submitDeclarationResponse.ResultDate,
            ResultStatus = response.submitDeclarationResponse.ResultStatus
                .ConvertToEnum<ResultStatus>(),
            TransmissionId = response.submitDeclarationResponse.TransmissionID,
            TransmissionIdSpecified = response.submitDeclarationResponse.TransmissionIDSpecified
        };
    }
}