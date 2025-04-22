using Accounting.Contract.Dto.Sti.VatReturn;
using Accounting.Contract.Service;

namespace Accounting.API.Endpoint;

public static class VatReturnAnonymousEndpoints
{
    public static void MapVatReturnAnonymousEndpoints(this RouteGroupBuilder builder)
    {
        builder
            .MapGet(String.Empty, GetByPreviewCode)
            .AllowAnonymous();

        builder
            .MapPost("/update", UpdateInfoByPreviewCode)
            .AllowAnonymous();
    }

    private static async Task<IResult> GetByPreviewCode(
        string code,
        IVatReturnService vatReturnService
    ) => Results.Json((await vatReturnService.GetByPreviewCodeAsync(code))?.ToDtoWithSale());

    private static async Task<IResult> UpdateInfoByPreviewCode(
        string code,
        IVatReturnService vatReturnService
    )
    {
        await vatReturnService.UpdateInfoAsync(new StiVatReturnDeclarationUpdateInfoRequest { PreviewCode = code });

        return Results.Ok();
    }
}