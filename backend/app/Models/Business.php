<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Business extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'city_id',
        'name',
        'slug',
        'short_description',
        'description',
        'address',
        'phone',
        'whatsapp',
        'email',
        'website',
        'opening_hours',
        'logo_path',
        'facebook',
        'instagram',
        'status',
        'admin_notes',
        'featured',
    ];

    protected $casts = [
        'featured' => 'boolean',
    ];

    protected $appends = [
        'logo_url',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($business) {
            if (empty($business->slug)) {
                $base = Str::slug($business->name);
                $slug = $base;
                $counter = 1;
                while (static::where('slug', $slug)->exists()) {
                    $slug = $base . '-' . $counter;
                    $counter++;
                }
                $business->slug = $slug;
            }
        });
    }

    protected function logoUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->logo_path) {
                    return null;
                }
                if (str_starts_with($this->logo_path, 'http://') || str_starts_with($this->logo_path, 'https://')) {
                    return $this->logo_path;
                }
                return url(Storage::url($this->logo_path));
            }
        );
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'business_category')
                    ->withTimestamps();
    }

    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', 'approved');
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', 'pending');
    }
}

