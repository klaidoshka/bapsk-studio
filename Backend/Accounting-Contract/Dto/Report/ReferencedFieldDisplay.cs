namespace Accounting.Contract.Dto.Report;

public record ReferencedFieldDisplay(
    int DataEntryFieldId,
    int DataEntryFieldValue,
    int? ReferenceDisplayFieldId
);