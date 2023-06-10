# CC-SMEUs

APIs documentation: https://documenter.getpostman.com/view/24378007/2s93mASykW


GCP TOOLS

Cloud Storage:
Cloud Storage digunakan untuk menyimpan file-file statis terutama gambar dari SME yang telah kami data. Adapun total gambar yang disimpan di cloud storage berjumlah 320 gambar dari SME dengan format jpeg. Kami membuat bucket dengan nama capstone-smeus dan mengatur izin akses untuk memastikan file-file dapat diakses dan ditampilkan di frontend nantinya. Berikut merupakan konfigurasi dari cloud storage yang kami gunakan:
![Konfigurasi Cloud Storage](https://github.com/Skycyon/CC-SMEUs/assets/102421135/c78b1f07-8423-4a23-90fd-462c334e3ffe)

Cloud IAM:
Kami menggunakan Cloud Identity and Access Management (IAM) untuk mengatur pengaturan keamanan dan izin akses. Kami membuat peran khusus dengan izin yang sesuai untuk setiap anggota tim dari Cloud Computing, membatasi akses hanya pada sumber daya yang diperlukan. Berikut merupakan pengaturan akses dari IAM yang kami gunakan:
![Konfigurasi IAM](https://github.com/Skycyon/CC-SMEUs/assets/102421135/3d1ddbe3-fc30-4e10-8d60-871e2b4ad5c2)

Cloud SQL:
Untuk menyimpan data-data dari aplikasi SMEUs, kami menggunakan Cloud SQL untuk menampung data-data seperti data SME, data user dan juga data lainnya. Kami membuat instance database dengan jenis MySQL 8.0 dengan nama instance smeus-capstone, mengatur pengguna dan izin akses, serta mengkonfigurasi mesin dari instance tersebut. Berikut merupakan pengaturan dari instance yang kami gunakan:
![Konfigurasi SQL Instance](https://github.com/Skycyon/CC-SMEUs/assets/102421135/639ba082-e40f-4273-b010-08e6709b5f60)

Compute Engine:
Kami menggunakan Compute Engine untuk menjalankan instance virtual yang menjalankan aplikasi SMEUs. Kami membuat instance dengan dengan nama smeus-api-instance kemudian mengatur firewall rules untuk mengizinkan akses ke port yang dibutuhkan sehingga memudahkan tim Mobile Development mengakses API yang dibutuhkan. Berikut merupakan konfigurasi dari instance Compute Engine yang kami gunakan:

![Konfigurasi Compute Engine-1](https://github.com/Skycyon/CC-SMEUs/assets/102421135/6277ef34-98ff-4d7a-bf04-578c1166242c)
![Konfigurasi Compute Engine-2](https://github.com/Skycyon/CC-SMEUs/assets/102421135/733e99ab-d187-4e91-99fc-e013227a7526)




