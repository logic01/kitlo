import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
}

/**
 * Unsigned Cloudinary uploads. Configure
 *   environment.cloudinaryCloudName = "your-cloud-name"
 *   environment.cloudinaryUploadPreset = "kitlo-unsigned"
 * (see Cloudinary settings → Upload → Add upload preset).
 *
 * For signed uploads (which Kitlo will want in production for tighter control),
 * the backend should expose `POST /api/uploads/sign` returning a signature, and
 * this service should switch to passing `signature` + `api_key` + `timestamp`.
 */
@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  upload(file: File | Blob): Observable<CloudinaryUploadResult> {
    const cloud = environment.cloudinaryCloudName;
    const preset = (environment as { cloudinaryUploadPreset?: string }).cloudinaryUploadPreset;

    if (!cloud) {
      // Inert mode: emit a placehold.co URL so the UI flow proceeds in dev.
      return from(
        Promise.resolve<CloudinaryUploadResult>({
          url: `https://placehold.co/800x600/333/eee?text=${encodeURIComponent('Upload disabled')}`,
          publicId: 'placeholder',
        }),
      );
    }

    const fd = new FormData();
    fd.append('file', file);
    if (preset) fd.append('upload_preset', preset);

    return from(
      fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
        method: 'POST',
        body: fd,
      })
        .then((r) => {
          if (!r.ok) throw new Error(`Cloudinary upload failed (${r.status})`);
          return r.json() as Promise<{
            secure_url: string;
            public_id: string;
            width?: number;
            height?: number;
          }>;
        })
        .then((r) => ({
          url: r.secure_url,
          publicId: r.public_id,
          width: r.width,
          height: r.height,
        })),
    );
  }
}
