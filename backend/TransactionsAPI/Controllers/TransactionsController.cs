using Microsoft.AspNetCore.Mvc;
using TransactionsAPI.DTOs;
using TransactionsAPI.Models;
using TransactionsAPI.Services;

namespace TransactionsAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionsController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpPost]
    public async Task<ActionResult<Transaction>> Register([FromBody] RegisterTransactionDto dto)
    {
        var transaction = await _transactionService.RegisterAsync(dto);
        return CreatedAtAction(nameof(GetByProduct), new { productId = transaction.ProductId }, transaction);
    }

    [HttpGet("product/{productId:guid}")]
    public async Task<ActionResult<IEnumerable<Transaction>>> GetByProduct(Guid productId)
    {
        var transactions = await _transactionService.GetByProductAsync(productId);
        return Ok(transactions);
    }
}
